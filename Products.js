import { Router } from "express";
import fs from 'fs/promises';

const productsRouter = Router();
const PRODUCTS_FILE = 'products.json';

async function readProducts() {
    try {
        const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading file:', err);
        return [];
    }
}

async function writeProducts(products) {
    try {
        await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf8');
    } catch (err) {
        console.error('Error writing file:', err);
    }
}

productsRouter.get("/", async (request, response) => {
    const { limit } = request.query;
    const products = await readProducts();

    let productsToShow = [];
    const showAllProducts = !limit;

    if (showAllProducts) {
        productsToShow = products;
    } else {
        productsToShow = products.slice(0, parseInt(limit));
    }

    response.send(productsToShow);
});

productsRouter.get("/:id", async (request, response) => {
    const { id } = request.params;
    const products = await readProducts();
    const product = products.find(item => item.id === parseInt(id));

    if (!product) {
        return response.status(404).send("No product of id " + id + " found");
    }

    response.send(product);
});

productsRouter.post("/", async (request, response) => {
    const newProduct = request.body;
    const products = await readProducts();
    const id = products.length + 1;
    products.push({ ...newProduct, id });
    await writeProducts(products);
    response.send("Product added.");
});

productsRouter.put("/:id", async (request, response) => {
    const { id } = request.params;
    const products = await readProducts();

    if (!products.some(item => item.id === parseInt(id))) {
        return response.status(404).send({ error: "No product of id " + id + " found" });
    }

    const bodyProduct = request.body;
    const updatedProducts = products.map(product => {
        if (product.id === parseInt(id)) {
            return { ...product, ...bodyProduct, id: parseInt(id) };
        }
        return product;
    });

    await writeProducts(updatedProducts);
    response.send("Updated product");
});

productsRouter.delete("/:id", async (request, response) => {
    const { id } = request.params;
    const products = await readProducts();
    const filteredProducts = products.filter(product => product.id !== parseInt(id));
    await writeProducts(filteredProducts);
    response.send(id + " deleted");
});

export default productsRouter;
