// Genera la máscara alfa del retrato con Vision (segmentación de personas, calidad .accurate).
// Uso: swift scripts/hero-photo/person-mask.swift entrada.jpg salida-mascara.png
// La máscara sale en escala de grises al tamaño de la imagen original (blanco = persona).
import AppKit
import CoreImage
import Vision

let args = CommandLine.arguments
guard args.count == 3 else {
  FileHandle.standardError.write("uso: swift person-mask.swift entrada.jpg salida.png\n".data(using: .utf8)!)
  exit(2)
}
let input = URL(fileURLWithPath: args[1])
let output = URL(fileURLWithPath: args[2])

guard let src = CIImage(contentsOf: input) else { fatalError("no se pudo leer \(input.path)") }

let request = VNGeneratePersonSegmentationRequest()
request.qualityLevel = .accurate
request.outputPixelFormat = kCVPixelFormatType_OneComponent8

let handler = VNImageRequestHandler(ciImage: src, options: [:])
try handler.perform([request])
guard let buffer = request.results?.first?.pixelBuffer else { fatalError("sin resultado de segmentación") }

// Escala la máscara al tamaño de la foto con Lanczos (bordes suaves, sin escalones).
var mask = CIImage(cvPixelBuffer: buffer)
let sx = src.extent.width / mask.extent.width
let sy = src.extent.height / mask.extent.height
mask = mask.applyingFilter("CILanczosScaleTransform", parameters: [
  kCIInputScaleKey: sy,
  kCIInputAspectRatioKey: sx / sy,
]).cropped(to: src.extent)

let ctx = CIContext(options: [.workingColorSpace: NSNull()])
guard let cg = ctx.createCGImage(mask, from: src.extent, format: .L8, colorSpace: CGColorSpaceCreateDeviceGray()) else {
  fatalError("no se pudo renderizar la máscara")
}
let rep = NSBitmapImageRep(cgImage: cg)
guard let png = rep.representation(using: .png, properties: [:]) else { fatalError("png") }
try png.write(to: output)
print("máscara \(Int(mask.extent.width))×\(Int(mask.extent.height)) (Vision \(CVPixelBufferGetWidth(buffer))×\(CVPixelBufferGetHeight(buffer))) → \(output.path)")
