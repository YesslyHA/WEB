let cart = [];
let total = 0;

function addToCart(product, price) {
    cart.push({ product, price });
    total += price;
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';
    cart.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${item.product}</td><td>$${item.price.toLocaleString()}</td>`;
        cartItems.appendChild(row);
    });
    document.getElementById('cartTotal').textContent = `$${total.toLocaleString()}`;
}

function enviarWhatsApp() {
    const mensaje = `Hola, quiero hacer el pedido de: ${cart.map(item => `${item.product} - $${item.price}`).join(', ')}. El total es $${total}.`;
    const url = `https://wa.me/57<-123456789?text=${encodeURIComponent(mensaje)}`;
    window.open(url);
}

document.getElementById('formRegistro').addEventListener('submit', function(e) {
    e.preventDefault();
    const datos = {
        nombre: this.nombre.value,
        telefono: this.telefono.value
    };
    fetch('http://localhost:3000/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById('registroMensaje').textContent = data.mensaje;
    })
    .catch(() => {
        document.getElementById('registroMensaje').textContent = 'Error al registrar usuario';
    });
});

document.getElementById('formLogin').addEventListener('submit', function(e) {
    e.preventDefault();
    const datos = {
        nombre: this.nombre.value,
        telefono: this.telefono.value
    };
    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById('loginMensaje').textContent = data.mensaje;
        const pedidosDiv = document.getElementById('pedidosAnteriores');
        if (data.pedidos && data.pedidos.length > 0) {
            let html = '<h3>Pedidos anteriores:</h3><ul>';
            data.pedidos.forEach(p => {
                html += `<li>${p.producto} - $${p.precio} - ${new Date(p.fecha).toLocaleString()}</li>`;
            });
            html += '</ul>';
            pedidosDiv.innerHTML = html;
        } else {
            pedidosDiv.innerHTML = '<p>No hay pedidos anteriores.</p>';
        }
    })
    .catch(() => {
        document.getElementById('loginMensaje').textContent = 'Error al consultar pedidos';
    });
});

document.getElementById('btnRegistro').onclick = function() {
    document.getElementById('registroUsuario').style.display = 'block';
    document.getElementById('loginUsuario').style.display = 'none';
    this.classList.add('active');
    document.getElementById('btnLogin').classList.remove('active');
};
document.getElementById('btnLogin').onclick = function() {
    document.getElementById('registroUsuario').style.display = 'none';
    document.getElementById('loginUsuario').style.display = 'block';
    this.classList.add('active');
    document.getElementById('btnRegistro').classList.remove('active');
};

function guardarPedido(nombre, telefono, productos) {
    fetch('http://localhost:3000/guardar-pedido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, telefono, productos })
    })
    .then(res => res.json())
    .then(data => alert(data.mensaje));
}

document.getElementById('btnGuardarPedido').onclick = function() {
    // Solicita nombre y teléfono al usuario (puedes usar los del login si ya está logueado)
    let nombre = '';
    let telefono = '';
    // Si el usuario está logueado, puedes guardar los datos en variables globales al hacer login
    if (document.getElementById('formLogin').nombre.value && document.getElementById('formLogin').telefono.value) {
        nombre = document.getElementById('formLogin').nombre.value;
        telefono = document.getElementById('formLogin').telefono.value;
    } else if (document.getElementById('formRegistro').nombre.value && document.getElementById('formRegistro').telefono.value) {
        nombre = document.getElementById('formRegistro').nombre.value;
        telefono = document.getElementById('formRegistro').telefono.value;
    } else {
        alert('Por favor ingresa tu nombre y teléfono en Registro o Ingreso.');
        return;
    }
    if (cart.length === 0) {
        alert('El carrito está vacío.');
        return;
    }
    guardarPedido(nombre, telefono, cart);
};

const db = require('mysql2').createConnection({
    host: 'localhost',
    user: 'TU_USUARIO',         // Cambia por tu usuario MySQL
    password: 'TU_CONTRASEÑA',  // Cambia por tu contraseña MySQL
    database: 'dulcetentacion'  // Este es el nombre de la base de datos
});
