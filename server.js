const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let products = [
    { id: 1, name: "Horse Toy", price: 500 },
    { id: 2, name: "Car Toy", price: 700 },
    { id: 3, name: "Doll", price: 450 }
];

let cart = [];

app.get("/products", (req, res) => {
    res.json(products);
});

app.get("/cart", (req, res) => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    res.json({ cart, total });
});

app.post("/cart", (req, res) => {
    const { productId } = req.body;
    const product = products.find(p => p.id === productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    res.json({ cart, total });
});

app.delete("/cart", (req, res) => {
    const { productId } = req.body;
    const cartItem = cart.find(item => item.id === productId);
    if (!cartItem) return res.status(404).json({ message: "Item not in cart" });

    if (cartItem.quantity > 1) {
        cartItem.quantity -= 1;
    } else {
        cart = cart.filter(item => item.id !== productId);
    }
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    res.json({ cart, total });
});

app.post("/checkout", (req, res) => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cart = [];
    res.json({ message: "Checkout successful!", total });
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
