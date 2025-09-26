const API_URL = "/api";
let products = [];
let currentUser = null;

// -------- Fetch products from backend --------
async function loadProducts() {
  try {
    const res = await fetch(`${API_URL}/products`);
    const data = await res.json();
    console.log("Products fetched:", data);
    products = data;
    renderProducts();
  } catch (err) {
    console.error("Error fetching products:", err);
  }
}

// -------- Render products to UI --------
function renderProducts() {
  const productsList = document.getElementById("products-list");
  productsList.innerHTML = "";

  if (products.length === 0) {
    productsList.innerHTML = "<p>No products available. Add some!</p>";
    return;
  }

  products.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${p.imageUrl}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>₹${p.price}</p>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
    `;
    productsList.appendChild(div);
  });
}

// -------- Cart functions --------
async function addToCart(productId) {
  if (!currentUser) {
    alert("⚠️ Please login first!");
    showSection("auth");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + currentUser.token
      },
      body: JSON.stringify({ productId, quantity: 1 })
    });

    await res.json();
    loadCart();
  } catch (err) {
    console.error("Error adding to cart:", err);
  }
}

async function loadCart() {
  if (!currentUser) return;

  try {
    const res = await fetch(`${API_URL}/cart`, {
      headers: {
        "Authorization": "Bearer " + currentUser.token
      }
    });

    const cartItems = await res.json();
    const cartList = document.getElementById("cart-items");
    cartList.innerHTML = "";
    let total = 0;

    cartItems.forEach(ci => {
      const item = ci.Product;
      let li = document.createElement("li");
      li.innerHTML = `
        ${item.name} - ₹${item.price} (x${ci.quantity})
        <button onclick="removeFromCart(${ci.id})" style="margin-left:10px; background:#dc3545; color:white; border:none; padding:4px 8px; cursor:pointer;">Remove</button>
      `;
      cartList.appendChild(li);
      total += item.price * ci.quantity;
    });

    document.getElementById("cart-total").textContent = total;
    document.getElementById("cart-count").textContent = cartItems.length;
  } catch (err) {
    console.error("Error loading cart:", err);
  }
}

async function removeFromCart(cartId) {
  if (!currentUser) return;

  try {
    await fetch(`${API_URL}/cart/${cartId}`, {
      method: "DELETE",
      headers: { "Authorization": "Bearer " + currentUser.token }
    });
    loadCart();
  } catch (err) {
    console.error("Error removing from cart:", err);
  }
}

async function checkout() {
  if (!currentUser) {
    alert("⚠️ Please login first!");
    showSection("auth");
    return;
  }
  try {
    await fetch(`${API_URL}/cart`, {
      method: "DELETE",
      headers: { "Authorization": "Bearer " + currentUser.token }
    });
    alert("✅ Checkout complete!");
    loadCart();
  } catch (err) {
    console.error("Error during checkout:", err);
  }
}

// -------- Section switching --------
function showSection(section) {
  document.getElementById("products").style.display = section === "products" ? "block" : "none";
  document.getElementById("cart").style.display = section === "cart" ? "block" : "none";
  document.getElementById("auth").style.display = section === "auth" ? "block" : "none";

  // 👑 Admin panel only visible in auth section and only if user is admin
  if (section === "auth" && currentUser && currentUser.isAdmin) {
    document.getElementById("admin").style.display = "block";
  } else {
    document.getElementById("admin").style.display = "none";
  }

  if (section === "cart") loadCart();
  if (section === "products") loadProducts();
}

// -------- Auth functions --------
async function login() {
  const email = document.getElementById("auth-email").value;
  const password = document.getElementById("auth-password").value;

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok && data.token) {
      currentUser = { email, token: data.token };
      await checkIfAdmin();
      showLoggedIn();
    } else {
      alert(data.msg || "❌ Login failed");
    }
  } catch (err) {
    console.error("Login error:", err);
  }
}

async function register() {
  const email = document.getElementById("auth-email").value;
  const password = document.getElementById("auth-password").value;

  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok && data.email) {
      alert("✅ Registration successful! Please login.");
    } else {
      alert(data.msg || "❌ Registration failed");
    }
  } catch (err) {
    console.error("Register error:", err);
  }
}

async function checkIfAdmin() {
  try {
    const res = await fetch(`${API_URL}/auth/users`, {
      headers: { "Authorization": "Bearer " + currentUser.token }
    });
    currentUser.isAdmin = res.ok;
  } catch (err) {
    console.error("Error checking admin status:", err);
    currentUser.isAdmin = false;
  }
}

async function loadAllUsers() {
  try {
    const res = await fetch(`${API_URL}/auth/users`, {
      headers: { "Authorization": "Bearer " + currentUser.token }
    });
    const users = await res.json();
    const userList = document.getElementById("users-list");
    userList.innerHTML = "";

    users.forEach(u => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${u.email} (${u.isAdmin ? "Admin" : "User"})
        <button onclick="deleteUser(${u.id})" style="margin-left:10px; background:#dc3545; color:white; border:none; padding:4px 8px; cursor:pointer;">Delete</button>
      `;
      userList.appendChild(li);
    });
  } catch (err) {
    console.error("Error loading users:", err);
  }
}

async function deleteUser(userId) {
  try {
    await fetch(`${API_URL}/auth/user/${userId}`, {
      method: "DELETE",
      headers: { "Authorization": "Bearer " + currentUser.token }
    });
    loadAllUsers();
  } catch (err) {
    console.error("Error deleting user:", err);
  }
}

function logout() {
  currentUser = null;
  document.getElementById("auth-form").style.display = "block";
  document.getElementById("auth-loggedin").style.display = "none";
  document.getElementById("nav-auth").textContent = "Login";
}

function showLoggedIn() {
  document.getElementById("user-email").textContent = currentUser.email;
  document.getElementById("auth-form").style.display = "none";
  document.getElementById("auth-loggedin").style.display = "block";
  document.getElementById("nav-auth").textContent = "Logout";
}

// -------- Load products on page load --------
window.onload = loadProducts;