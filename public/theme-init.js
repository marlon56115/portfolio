// Se ejecuta en <head> antes de pintar: marca que hay JS y aplica el tema guardado.
(function () {
  var d = document.documentElement;
  d.classList.add('js');
  try {
    var t = localStorage.getItem('theme');
    if (t === 'light' || t === 'dark') d.setAttribute('data-theme', t);
  } catch (e) {}
})();
