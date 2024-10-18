const socket = io();

document.addEventListener("DOMContentLoaded", () => {
    const contenedorProductos = document.getElementById("contenedorProductos");

    socket.on("productos", (data) => {
        renderProductos(data);
    });

    const btnAgregarProducto = document.getElementById("btnAgregarProducto");
    const btnEliminar = document.getElementById("btnEliminar");

    btnAgregarProducto.addEventListener("click", (event) => {
        event.preventDefault();
        agregarProducto();
    });

    btnEliminar.addEventListener("click", async () => {
        const productId = document.getElementById("productId").value;
        eliminarProducto(productId);
    });

    const renderProductos = (productos) => {
        contenedorProductos.innerHTML = "";
        productos.forEach(({ thumbnails, title, description, price, id }) => {
            const card = document.createElement("div");
            card.classList.add("col-md-4", "p-2");
            card.innerHTML = `
              <div class="card col" style="width: 18rem;">
                  <img src="${thumbnails}" class="card-img-top" alt="...">
                  <div class="card-body">
                      <h5 class="card-title">${title}</h5>
                      <p class="card-text">${description}</p>
                      <p class="card-text">$${price}</p>
                      <a class="btn btn-primary">Eliminar</a>
                  </div>
              </div>`;
            contenedorProductos.appendChild(card);
            card.querySelector("a").addEventListener("click", () => eliminarProducto(id));
        });
    };

    const eliminarProducto = async (id) => {
        if (!id) return console.error("ID no válido");
        try {
            const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
            const data = await response.json();
            if (response.ok) {
                console.log(`Producto eliminado con ID: ${id}`);
                socket.emit("solicitarProductos");
            } else {
                console.error(`Error al eliminar producto: ${data.error}`);
            }
        } catch (error) {
            console.error("Error eliminando el producto:", error);
        }
    };

    const agregarProducto = async () => {
        const nuevoProducto = {
            title: document.getElementById("inputTitle").value,
            description: document.getElementById("inputDescription").value,
            code: document.getElementById("inputCode").value,
            price: parseFloat(document.getElementById("inputPrice").value),
            stock: parseInt(document.getElementById("inputStock").value),
            category: document.getElementById("inputCategory").value,
            thumbnails: document.getElementById("inputThumbnails").value,
            status: true
        };

        try {
            const response = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoProducto)
            });
            if (response.ok) {
                console.log("Producto agregado exitosamente");
                socket.emit("solicitarProductos");
            } else {
                const errorData = await response.json();
                console.error("Error al agregar producto:", errorData.error);
            }
        } catch (error) {
            console.error("Error al enviar el formulario:", error);
        }

        document.getElementById("formAgregarProducto").reset();
    };
});