import express from "express";
import { Sequelize, DataTypes } from "sequelize";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Banco de Dados (SQLite em memória) -----------------------------------------

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: ":memory:",
  logging: false,
});

const Potion = sequelize.define("Potion", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// Seed de poções iniciais ----------------------------------------------------

async function seedDatabase() {
  const potions = [
    {
      name: "Poção Blue Sky",
      description:
        "Essa poção provê um surto de inspiração por 24 horas. Foi utilizada por John Lennon quando escreveu Lucy in the Sky with Diamonds.",
      image: "/images/potion_blue_sky.png",
      price: 300,
    },
    {
      name: "Poção do Perfume Misterioso",
      description:
        "Essa poção faz com que você fique cheirando lilás e groselha por 24 dias. Essência muito admirada pelos bruxos.",
      image: "/images/potion_perfume.png",
      price: 200,
    },
    {
      name: "Poção de Pinus",
      description:
        "Essa poção faz com que você fique 10 cm mais alto! Observação: efeitos colaterais desconhecidos.",
      image: "/images/potion_pinus.png",
      price: 3000,
    },
    {
      name: "Poção da Beleza Eterna",
      description: "Veneno que mata rápido.",
      image: "/images/potion_beleza.png",
      price: 100,
    },
    {
      name: "Poção do Arco Íris",
      description:
        "Traz felicidade momentânea. Pode durar de 10 minutos a 2 dias.",
      image: "/images/potion_arcoiris.png",
      price: 120,
    },
    {
      name: "Caldeirão das Verdades Secretas",
      description:
        "As pessoas lhe dirão apenas verdades por 1 hora. É necessário beber os 5L.",
      image: "/images/potion_caldeirao.png",
      price: 150,
    },
  ];

  for (const potion of potions) {
    await Potion.create(potion);
  }

  console.log(`${potions.length} poções cadastradas no banco de dados.`);
}

// Servidor Express -----------------------------------------------------------

const app = express();
const PORT = 3000;

app.use(express.json());

// Arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));
app.use("/script", express.static(path.join(__dirname, "script")));
app.use("/style", express.static(path.join(__dirname, "style")));
app.use("/images", express.static(path.join(__dirname, "public", "images")));

// API REST -------------------------------------------------------------------

// GET /api/potions — listar todas as poções
app.get("/api/potions", async (_req, res) => {
  try {
    const potions = await Potion.findAll({ order: [["id", "ASC"]] });
    res.json(potions);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar poções." });
  }
});

// GET /api/potions/:id — buscar poção por ID
app.get("/api/potions/:id", async (req, res) => {
  try {
    const potion = await Potion.findByPk(req.params.id);
    if (!potion) {
      return res.status(404).json({ error: "Poção não encontrada." });
    }
    res.json(potion);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar poção." });
  }
});

// POST /api/potions — criar nova poção
app.post("/api/potions", async (req, res) => {
  try {
    const { name, description, image, price } = req.body;

    if (!name || !description || !image || price === undefined) {
      return res.status(400).json({
        error: "Todos os campos são obrigatórios: name, description, image, price.",
      });
    }

    const potion = await Potion.create({
      name,
      description,
      image,
      price: parseInt(price, 10),
    });

    res.status(201).json(potion);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar poção." });
  }
});

// DELETE /api/potions/:id — remover poção por ID
app.delete("/api/potions/:id", async (req, res) => {
  try {
    const potion = await Potion.findByPk(req.params.id);
    if (!potion) {
      return res.status(404).json({ error: "Poção não encontrada." });
    }
    await potion.destroy();
    res.json({ message: "Poção removida com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao remover poção." });
  }
});

// Inicialização --------------------------------------------------------------

async function start() {
  try {
    await sequelize.sync({ force: true });
    console.log("Banco de dados sincronizado.");

    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`\nPoções e Soluções rodando em http://localhost:${PORT}`);
      console.log(`Admin: http://localhost:${PORT}/admin.html`);
      console.log(`Loja:  http://localhost:${PORT}/\n`);
    });
  } catch (error) {
    console.error("Erro ao iniciar o servidor:", error);
    process.exit(1);
  }
}

start();
