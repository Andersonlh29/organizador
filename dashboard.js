let usuario = "";
let tareas = [];

document.getElementById('btnNuevo').addEventListener('click', mostrarNuevo);
document.getElementById('btnLista').addEventListener('click', mostrarLista);
document.getElementById('btnCerrar').addEventListener('click', cerrarSesion);

window.onload = () => {
  usuario = localStorage.getItem("usuarioActivo");
  if (!usuario) {
    window.location.href = "index.html";
  } else {
    cargarTareas();
    mostrarBienvenida();
  }
};

function mostrarBienvenida() {
  const panel = document.getElementById('panelContent');
  panel.innerHTML = `<h2>Bienvenido ${usuario}</h2><p>Seleccione una opción en el menú.</p>`;
}

function mostrarNuevo() {
  const panel = document.getElementById('panelContent');

  const today = new Date().toISOString().split('T')[0];

  panel.innerHTML = `
    <h3>Agendar nuevo compromiso</h3>
    <input type="text" id="tareaInput" placeholder="Descripción de la tarea" style="width:90%;padding:10px;margin:10px 0;">
    <label>Fecha:</label>
    <input type="date" id="fechaInput" min="${today}" style="width:90%;padding:10px;margin:10px 0;">
    <label>Hora:</label>
    <select id="horaInput" style="width:90%;padding:10px;margin:10px 0;">
      ${generarHoras(today)}
    </select>
    <button onclick="guardarTarea()" style="padding:10px 20px;">Guardar</button>
  `;

  document.getElementById('fechaInput').addEventListener('change', actualizarHoras);
}

function generarHoras(fechaSeleccionada) {
  let opciones = "";
  const ahora = new Date();

  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const hh = String(h).padStart(2, '0');
      const mm = String(m).padStart(2, '0');
      const horaCompleta = new Date(`${fechaSeleccionada}T${hh}:${mm}`);
      if (horaCompleta >= ahora) {
        opciones += `<option value="${hh}:${mm}">${hh}:${mm}</option>`;
      }
    }
  }

  return opciones;
}

function actualizarHoras() {
  const fecha = document.getElementById('fechaInput').value;
  const selectHora = document.getElementById('horaInput');
  selectHora.innerHTML = generarHoras(fecha);
}

function guardarTarea() {
  const tarea = document.getElementById('tareaInput').value;
  const fecha = document.getElementById('fechaInput').value;
  const hora = document.getElementById('horaInput').value;

  if (!tarea || !fecha || !hora) {
    alert("Complete todos los campos.");
    return;
  }

  const today = new Date();
  const fechaSeleccionada = new Date(fecha + "T" + hora);

  if (fechaSeleccionada < today) {
    alert("La fecha y hora seleccionadas ya pasaron. Escoja una futura.");
    return;
  }

  tareas.push({ tarea, fecha, hora, estado: "pendiente" });
  guardarTareas();
  alert("Tarea guardada.");

  // ✅ Limpiar campos
  document.getElementById('tareaInput').value = "";
  document.getElementById('fechaInput').value = "";
  document.getElementById('horaInput').innerHTML = "";
}

function mostrarLista() {
  const panel = document.getElementById('panelContent');
  let html = `<h3>Compromisos guardados</h3>`;

  if (tareas.length === 0) {
    html += `<p>No hay tareas guardadas.</p>`;
  } else {
    html += `
      <table style="width:100%; border-collapse: collapse; text-align: left;">
        <thead>
          <tr style="background: #eee;">
            <th style="padding:10px;">Lista tareas</th>
            <th style="padding:10px;">Cancelar</th>
            <th style="padding:10px;">Completar</th>
          </tr>
        </thead>
        <tbody>`;

    tareas.forEach((t, index) => {
      const color = t.estado === "completado"
        ? "background: lightgreen;"
        : t.estado === "cancelado"
        ? "background: lightcoral;"
        : "";

        // ✅ Si la tarea NO está pendiente, bloquea ambos
      let disabledCancelar = "";
      let disabledCompletar = "";

      if (t.estado !== "pendiente") {
        disabledCancelar = "disabled";
        disabledCompletar = "disabled";
      }


      html += `
        <tr style="${color}">
          <td style="padding:10px;"><strong>${t.fecha} ${t.hora}</strong>: ${t.tarea}</td>
          <td style="padding:10px;">
            <button onclick="cancelarTarea(${index})" ${disabled}>Cancelar</button>
          </td>
          <td style="padding:10px;">
            <button onclick="completarTarea(${index})" ${disabledComplete}>Completar</button>
          </td>
        </tr>
      `;
    });

    html += `
        </tbody>
      </table>`;
  }

  panel.innerHTML = html;
}

function cancelarTarea(index) {
  tareas[index].estado = "cancelado";
  guardarTareas();
  mostrarLista();
}

function completarTarea(index) {
  tareas[index].estado = "completado";
  guardarTareas();
  mostrarLista();
}

function cerrarSesion() {
  localStorage.removeItem("usuarioActivo");
  window.location.href = "index.html";
}

function guardarTareas() {
  localStorage.setItem(`tareas_${usuario}`, JSON.stringify(tareas));
}

function cargarTareas() {
  tareas = JSON.parse(localStorage.getItem(`tareas_${usuario}`)) || [];
}
