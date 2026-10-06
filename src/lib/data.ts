export type Extra = { id: string; name: string; price: number };

export type Dish = {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  popular?: boolean;
  extras: Extra[];
};

export type Restaurant = {
  id: string;
  name: string;
  cuisine: string;
  image: string;
  rating: number;
  reviewCount: number;
  deliveryMin: number;
  deliveryMax: number;
  deliveryFee: number;
  distanceKm: number;
  flash: boolean;
  tags: string[];
  about: string;
  neighborhood: string;
  story: string;
};

export type Category = {
  id: string;
  label: string;
  image: string;
  cuisine?: string;
  special?: "flash" | "market";
};

export type Coupon = {
  code: string;
  label: string;
  description: string;
  type: "percent" | "fixed" | "delivery";
  value: number;
  min: number;
};

export type SavedAddress = {
  id: string;
  label: string;
  street: string;
  neighborhood: string;
  city: string;
  complement?: string;
};

const DRINK: Extra = { id: "refri", name: "Refrigerante lata", price: 7.9 };
const CUTLERY: Extra = { id: "talher", name: "Talher", price: 0 };
const SAUCE: Extra = { id: "molho", name: "Molho extra", price: 3.5 };
const DESSERT: Extra = { id: "doce", name: "Doce da casa", price: 9.9 };

function dish(
  restaurantId: string,
  slug: string,
  name: string,
  description: string,
  price: number,
  image: string,
  category: string,
  popular = false,
  extras: Extra[] = [DRINK],
): Dish {
  return {
    id: `${restaurantId}-${slug}`,
    restaurantId,
    name,
    description,
    price,
    image,
    category,
    popular,
    extras,
  };
}

export const ADDRESSES: SavedAddress[] = [
  {
    id: "augusta",
    label: "Casa",
    street: "Rua Augusta, 1508",
    neighborhood: "Consolação",
    city: "São Paulo",
    complement: "Apto 72",
  },
  {
    id: "paulista",
    label: "Trabalho",
    street: "Av. Paulista, 1578",
    neighborhood: "Bela Vista",
    city: "São Paulo",
    complement: "Conj. 1204",
  },
  {
    id: "harmonia",
    label: "Galera",
    street: "Rua Harmonia, 88",
    neighborhood: "Vila Madalena",
    city: "São Paulo",
  },
];

export const COUPONS: Coupon[] = [
  {
    code: "PEDIU10",
    label: "10% na sacola",
    description: "Válido acima de R$ 40",
    type: "percent",
    value: 10,
    min: 40,
  },
  {
    code: "FLASH99",
    label: "Entrega grátis",
    description: "Em qualquer restaurante Flash",
    type: "delivery",
    value: 1,
    min: 0,
  },
  {
    code: "FOME20",
    label: "R$ 20 off",
    description: "Pedidos a partir de R$ 59",
    type: "fixed",
    value: 20,
    min: 59,
  },
  {
    code: "PIX5",
    label: "R$ 5 no Pix",
    description: "Só no pagamento via Pix",
    type: "fixed",
    value: 5,
    min: 25,
  },
];

export const CATEGORIES: Category[] = [
  { id: "flash", label: "Flash 99", image: "/food/burger.jpg", special: "flash" },
  { id: "pizza", label: "Pizza", image: "/food/pizza.jpg", cuisine: "Pizza" },
  { id: "burger", label: "Burger", image: "/food/burger.jpg", cuisine: "Lanches" },
  { id: "japa", label: "Japonesa", image: "/food/sushi.jpg", cuisine: "Japonesa" },
  { id: "br", label: "Brasileira", image: "/food/feijoada.jpg", cuisine: "Brasileira" },
  { id: "churras", label: "Churrasco", image: "/food/churrasco.jpg", cuisine: "Churrasco" },
  { id: "saude", label: "Saudável", image: "/food/acai.jpg", cuisine: "Saudável" },
  { id: "massas", label: "Massas", image: "/food/pasta.jpg", cuisine: "Italiana" },
  { id: "thai", label: "Thai", image: "/food/thai.jpg", cuisine: "Tailandesa" },
  { id: "poke", label: "Poke", image: "/food/poke.jpg", cuisine: "Poke" },
  { id: "cafe", label: "Café", image: "/food/cafe.jpg", cuisine: "Padaria" },
  { id: "market", label: "Mercado", image: "/food/feijoada.jpg", special: "market" },
];

export const RESTAURANTS: Restaurant[] = [
  {
    id: "brasa-da-vila",
    name: "Brasa da Vila",
    cuisine: "Churrasco",
    image: "/food/churrasco.jpg",
    rating: 4.8,
    reviewCount: 3120,
    deliveryMin: 28,
    deliveryMax: 42,
    deliveryFee: 7.99,
    distanceKm: 2.4,
    flash: false,
    tags: ["picanha", "família", "fim de semana"],
    about: "Fogo de chão em cubas de ferro. A picanha sai com a capa crocante e o chimichurri da casa.",
    neighborhood: "Vila Madalena",
    story: "Picanha no ponto com farofa crocante. Hoje a costela está no forno há 8 horas.",
  },
  {
    id: "napoli-di-roma",
    name: "Napoli di Roma",
    cuisine: "Pizza",
    image: "/food/pizza.jpg",
    rating: 4.7,
    reviewCount: 5488,
    deliveryMin: 25,
    deliveryMax: 40,
    deliveryFee: 5.9,
    distanceKm: 1.8,
    flash: false,
    tags: ["forno a lenha", "massa 48h"],
    about: "Massa fermentada 48h, forno 450 °C, mozzarella de búfala. A borda é o evento.",
    neighborhood: "Pinheiros",
    story: "A margherita de búfala acaba sempre. Forno aceso até meia-noite.",
  },
  {
    id: "nikkei-88",
    name: "Nikkei 88",
    cuisine: "Japonesa",
    image: "/food/sushi.jpg",
    rating: 4.9,
    reviewCount: 1904,
    deliveryMin: 32,
    deliveryMax: 48,
    deliveryFee: 8.9,
    distanceKm: 3.1,
    flash: false,
    tags: ["omakase", "salmão"],
    about: "Cortes limpos, arroz temperado no ponto, combinados que não parecem delivery.",
    neighborhood: "Itaim Bibi",
    story: "O salmão da manhã chegou agora. Combinado 88 por tempo limitado.",
  },
  {
    id: "smash-club",
    name: "Smash Club",
    cuisine: "Lanches",
    image: "/food/burger.jpg",
    rating: 4.6,
    reviewCount: 8210,
    deliveryMin: 12,
    deliveryMax: 18,
    deliveryFee: 0,
    distanceKm: 0.7,
    flash: true,
    tags: ["smash", "flash"],
    about: "Blend 80/20, smash na chapa de ferro, molho secreto. Sai em minutos, chega quente.",
    neighborhood: "Consolação",
    story: "Double smash + batata crocante. Flash 99: na sua mão em 15 minutos.",
  },
  {
    id: "acai-do-parque",
    name: "Açaí do Parque",
    cuisine: "Saudável",
    image: "/food/acai.jpg",
    rating: 4.8,
    reviewCount: 2640,
    deliveryMin: 10,
    deliveryMax: 16,
    deliveryFee: 0,
    distanceKm: 0.5,
    flash: true,
    tags: ["açaí", "flash"],
    about: "Açaí batido na hora, granola da casa, zero xarope. Tigelas que pesam na mão.",
    neighborhood: "Jardins",
    story: "Tigela 500 ml com granola crocante. Flash: sai gelado, chega gelado.",
  },
  {
    id: "padaria-lume",
    name: "Padaria Lume",
    cuisine: "Padaria",
    image: "/food/cafe.jpg",
    rating: 4.7,
    reviewCount: 1560,
    deliveryMin: 14,
    deliveryMax: 22,
    deliveryFee: 3.9,
    distanceKm: 1.1,
    flash: true,
    tags: ["café", "pão de queijo"],
    about: "Pão de queijo de minas, croissant de manteiga, espresso curto. Manhã inteira no ponto.",
    neighborhood: "Bela Vista",
    story: "O croissant saiu do forno agora. Combo café + pão de queijo até as 11h.",
  },
  {
    id: "thai-siam",
    name: "Thai Siam",
    cuisine: "Tailandesa",
    image: "/food/thai.jpg",
    rating: 4.6,
    reviewCount: 980,
    deliveryMin: 30,
    deliveryMax: 45,
    deliveryFee: 6.9,
    distanceKm: 2.8,
    flash: false,
    tags: ["picante", "pad thai"],
    about: "Pad thai na wok quente, curry vermelho, lima e amendoim. Combina o fogo com o doce.",
    neighborhood: "Brooklin",
    story: "Pad thai de camarão no wok. Peça o nível de pimenta — a casa não recua.",
  },
  {
    id: "nonna-rosa",
    name: "Nonna Rosa",
    cuisine: "Italiana",
    image: "/food/pasta.jpg",
    rating: 4.8,
    reviewCount: 2211,
    deliveryMin: 26,
    deliveryMax: 38,
    deliveryFee: 6.5,
    distanceKm: 2.0,
    flash: false,
    tags: ["massa fresca", "nonna"],
    about: "Tagliatelle fresco, carbonara sem creme, ragu que cozinha desde as 7h.",
    neighborhood: "Bela Vista",
    story: "Carbonara da nonna — pecorino, pimenta, gema. Sem atalhos.",
  },
  {
    id: "poke-wave",
    name: "Poke Wave",
    cuisine: "Poke",
    image: "/food/poke.jpg",
    rating: 4.5,
    reviewCount: 1744,
    deliveryMin: 15,
    deliveryMax: 22,
    deliveryFee: 0,
    distanceKm: 1.3,
    flash: true,
    tags: ["poke", "almoço"],
    about: "Arroz de sushi, atum fresco, manga, crispy. Monte o bowl ou pegue o da casa.",
    neighborhood: "Vila Olímpia",
    story: "Bowl de atum com manga. Flash no almoço — 18 minutos ou a taxa some.",
  },
  {
    id: "casa-do-feijao",
    name: "Casa do Feijão",
    cuisine: "Brasileira",
    image: "/food/feijoada.jpg",
    rating: 4.9,
    reviewCount: 4302,
    deliveryMin: 35,
    deliveryMax: 50,
    deliveryFee: 4.9,
    distanceKm: 3.4,
    flash: false,
    tags: ["feijoada", "almoço"],
    about: "Feijoada completa de quarta a sábado, torresmo, couve fina, laranja. Comida de vó.",
    neighborhood: "Liberdade",
    story: "Feijoada completa com laranja e couve. Quarta e sábado a casa inteira pede.",
  },
  {
    id: "ramen-do-tigre",
    name: "Ramen do Tigre",
    cuisine: "Japonesa",
    image: "/food/sushi.jpg",
    rating: 4.7,
    reviewCount: 1333,
    deliveryMin: 24,
    deliveryMax: 36,
    deliveryFee: 6.9,
    distanceKm: 2.2,
    flash: false,
    tags: ["ramen", "caldo 18h"],
    about: "Tonkotsu de 18 horas, chashu lacrado, ovo ajitsuke. O caldo chega selado.",
    neighborhood: "Pinheiros",
    story: "Tonkotsu selado — o vapor fica no pote até abrir. Peça o extra chashu.",
  },
  {
    id: "cacau-canela",
    name: "Cacau & Canela",
    cuisine: "Doces",
    image: "/food/cafe.jpg",
    rating: 4.8,
    reviewCount: 2888,
    deliveryMin: 20,
    deliveryMax: 30,
    deliveryFee: 4.5,
    distanceKm: 1.6,
    flash: false,
    tags: ["brigadeiro", "bolo"],
    about: "Brigadeiro de 70%, bolo de leite ninho, sobremesa que merece um pedido só dela.",
    neighborhood: "Jardins",
    story: "Caixa de brigadeiros da casa. O de pistache acaba antes das 20h.",
  },
  {
    id: "arabesco",
    name: "Arabesco",
    cuisine: "Árabe",
    image: "/food/thai.jpg",
    rating: 4.6,
    reviewCount: 1090,
    deliveryMin: 22,
    deliveryMax: 34,
    deliveryFee: 5.5,
    distanceKm: 1.9,
    flash: false,
    tags: ["esfiha", "wrap"],
    about: "Esfiha aberta no forno, wrap de falafel, homus com azeite sírio.",
    neighborhood: "Paraíso",
    story: "Combo wrap + homus. O pão sai do saj na hora do pedido.",
  },
  {
    id: "coxinha-da-esquina",
    name: "Coxinha da Esquina",
    cuisine: "Salgados",
    image: "/food/burger.jpg",
    rating: 4.5,
    reviewCount: 6401,
    deliveryMin: 12,
    deliveryMax: 18,
    deliveryFee: 0,
    distanceKm: 0.4,
    flash: true,
    tags: ["coxinha", "flash"],
    about: "Coxinha de frango com catupiry, massa fina, óleo trocado. Bar da esquina, padrão de padaria fina.",
    neighborhood: "Consolação",
    story: "Kit 6 coxinhas crocantes. Flash 99 — chega ainda quente.",
  },
  {
    id: "mercado-pediu",
    name: "Mercado Pediu",
    cuisine: "Mercado",
    image: "/food/feijoada.jpg",
    rating: 4.7,
    reviewCount: 920,
    deliveryMin: 15,
    deliveryMax: 25,
    deliveryFee: 3.9,
    distanceKm: 0.9,
    flash: true,
    tags: ["mercado", "relâmpago"],
    about: "Hortifruti, mercearia e laticínios em até 25 minutos. O mercado que corre como moto da 99.",
    neighborhood: "Consolação",
    story: "Banana, leite e pão na sua porta. Mercado relâmpago o dia inteiro.",
  },
];

export const DISHES: Dish[] = [
  dish("brasa-da-vila", "picanha", "Picanha fatiada 400g", "Capa crocante, ponto mal, chimichurri e farofa de ovos.", 89.9, "/food/churrasco.jpg", "Cortes", true, [DRINK, SAUCE, { id: "farofa", name: "Farofa extra", price: 8.9 }]),
  dish("brasa-da-vila", "costela", "Costela 8 horas", "Desfia no garfo, vinagrete e mandioca frita.", 79.9, "/food/churrasco.jpg", "Cortes", false, [DRINK]),
  dish("brasa-da-vila", "maminha", "Maminha na faca", "Grelha alta, sal grosso, molho da casa.", 69.9, "/food/churrasco.jpg", "Cortes"),
  dish("brasa-da-vila", "combo", "Combo brasa pra 2", "Picanha, linguiça, arroz, vinagrete e farofa.", 149.0, "/food/churrasco.jpg", "Combos", true, [DRINK, DESSERT]),
  dish("brasa-da-vila", "alcatra", "Alcatra acebolada", "Cebola queimada na chapa, arroz soltinho.", 62.9, "/food/churrasco.jpg", "Cortes"),

  dish("napoli-di-roma", "margherita", "Margherita di bufala", "San Marzano, búfala, manjericão, azeite siciliano.", 64.9, "/food/pizza.jpg", "Pizzas", true, [DRINK, { id: "borda", name: "Borda de catupiry", price: 12 }]),
  dish("napoli-di-roma", "diavola", "Diavola", "Salame picante, mozzarella, mel de pimenta.", 69.9, "/food/pizza.jpg", "Pizzas", true, [DRINK, { id: "borda", name: "Borda de catupiry", price: 12 }]),
  dish("napoli-di-roma", "funghi", "Funghi porcini", "Cogumelos, tomilho, parmesão 24 meses.", 72.0, "/food/pizza.jpg", "Pizzas"),
  dish("napoli-di-roma", "calabresa", "Calabresa da casa", "Calabresa artesanal, cebola roxa, azeitona.", 59.9, "/food/pizza.jpg", "Pizzas"),
  dish("napoli-di-roma", "cannoli", "Cannoli de pistache", "Dois cannoli crocantes, creme de pistache.", 24.9, "/food/cafe.jpg", "Doces", false, []),

  dish("nikkei-88", "combo88", "Combinado 88", "24 peças: salmão, atum, peixe branco e hot philadelphia.", 98.0, "/food/sushi.jpg", "Combinados", true, [DRINK, { id: "gyoza", name: "Gyoza (4un)", price: 18 }]),
  dish("nikkei-88", "sashimi", "Sashimi de salmão 12un", "Corte alto, wasabi fresco, gengibre.", 72.0, "/food/sushi.jpg", "Sashimi", true),
  dish("nikkei-88", "hot", "Hot roll especial", "Empanado, cream cheese, tarê e crispy.", 42.9, "/food/sushi.jpg", "Hot"),
  dish("nikkei-88", "temaki", "Temaki de salmão", "Folha crocante, arroz morno, salmão fresco.", 28.9, "/food/sushi.jpg", "Temaki"),
  dish("nikkei-88", "ceviche", "Ceviche nikkei", "Peixe branco, leite de tigre, pimenta, milho.", 46.0, "/food/poke.jpg", "Entradas"),

  dish("smash-club", "double", "Double smash", "Dois smash, cheddar, picles, molho secreto, brioche.", 38.9, "/food/burger.jpg", "Burgers", true, [DRINK, { id: "bacon", name: "Bacon extra", price: 6 }, { id: "batata", name: "Batata smash", price: 14.9 }]),
  dish("smash-club", "triple", "Triple smash", "Três carnes, queijo americano, onion crunch.", 46.9, "/food/burger.jpg", "Burgers", true, [DRINK, { id: "batata", name: "Batata smash", price: 14.9 }]),
  dish("smash-club", "chicken", "Chicken smash", "Frango empanado, picles agridoce, maionese de alho.", 34.9, "/food/burger.jpg", "Burgers"),
  dish("smash-club", "fries", "Batata smash", "Frita duas vezes, parmesão e páprica.", 16.9, "/food/burger.jpg", "Acompanhamentos", false, [SAUCE]),
  dish("smash-club", "shake", "Shake de doce de leite", "Sorvete, doce de leite, flor de sal.", 18.9, "/food/cafe.jpg", "Sobremesas", false, []),

  dish("acai-do-parque", "tigela500", "Tigela 500ml", "Açaí, banana, morango, granola da casa, mel.", 28.9, "/food/acai.jpg", "Tigelas", true, [{ id: "leite", name: "Leite ninho", price: 3.5 }, { id: "pacoca", name: "Paçoca", price: 3 }]),
  dish("acai-do-parque", "tigela700", "Tigela 700ml", "Açaí puro, frutas da estação, coco, mel.", 36.9, "/food/acai.jpg", "Tigelas", true),
  dish("acai-do-parque", "bowl", "Bowl proteína", "Açaí, pasta de amendoim, whey, banana, cacau.", 32.9, "/food/acai.jpg", "Tigelas"),
  dish("acai-do-parque", "smoothie", "Smoothie de morango", "Morango, banana, leite vegetal.", 18.0, "/food/acai.jpg", "Bebidas", false, []),
  dish("acai-do-parque", "salad", "Salada citrus", "Folhas, feta, semente, molho de laranja.", 29.9, "/food/poke.jpg", "Saladas"),

  dish("padaria-lume", "combo-manha", "Combo manhã", "Pão de queijo, croissant e espresso.", 24.9, "/food/cafe.jpg", "Combos", true, [{ id: "suco", name: "Suco de laranja", price: 9.9 }]),
  dish("padaria-lume", "pao-queijo", "Pão de queijo (6un)", "Mineiro, elástico, queijo meia-cura.", 16.9, "/food/cafe.jpg", "Salgados", true),
  dish("padaria-lume", "croissant", "Croissant de manteiga", "Folhado 36 camadas, ainda quente.", 14.9, "/food/cafe.jpg", "Folhados"),
  dish("padaria-lume", "espresso", "Espresso curto", "Blend da casa, extração 26s.", 7.5, "/food/cafe.jpg", "Cafés", false, []),
  dish("padaria-lume", "misto", "Misto quente de padaria", "Pão de forma, queijo, presunto, manteiga na chapa.", 18.9, "/food/cafe.jpg", "Lanches"),

  dish("thai-siam", "padthai", "Pad thai de camarão", "Wok quente, tamarindo, amendoim, lima.", 54.9, "/food/thai.jpg", "Wok", true, [DRINK, { id: "pimenta", name: "Pimenta extra", price: 0 }]),
  dish("thai-siam", "curry", "Curry vermelho", "Leite de coco, basilicão thai, arroz jasmim.", 49.9, "/food/thai.jpg", "Currys", true),
  dish("thai-siam", "somtam", "Som tam", "Salada de mamão verde, pimenta, amendoim.", 32.0, "/food/thai.jpg", "Entradas"),
  dish("thai-siam", "satay", "Satay de frango", "Espetinhos, molho de amendoim.", 36.9, "/food/thai.jpg", "Entradas"),
  dish("thai-siam", "mango", "Mango sticky rice", "Manga madura, arroz doce, leite de coco.", 22.9, "/food/acai.jpg", "Doces", false, []),

  dish("nonna-rosa", "carbonara", "Tagliatelle carbonara", "Gema, guanciale, pecorino, pimenta do reino.", 58.9, "/food/pasta.jpg", "Massas", true, [DRINK, CUTLERY]),
  dish("nonna-rosa", "ragu", "Pappardelle ao ragu", "Ragu de costela 7 horas, massa fresca.", 62.9, "/food/pasta.jpg", "Massas", true),
  dish("nonna-rosa", "pomodoro", "Spaghetti pomodoro", "Tomate pelado, manjericão, azeite.", 44.9, "/food/pasta.jpg", "Massas"),
  dish("nonna-rosa", "gnocchi", "Gnocchi de batata", "Manteiga de sálvia, parmesão.", 52.0, "/food/pasta.jpg", "Massas"),
  dish("nonna-rosa", "tiramisu", "Tiramisù da nonna", "Café, mascarpone, cacau.", 24.9, "/food/cafe.jpg", "Doces", false, []),

  dish("poke-wave", "atum", "Poke de atum", "Atum, manga, avocado, crispy, gergelim.", 42.9, "/food/poke.jpg", "Bowls", true, [{ id: "spicy", name: "Molho spicy extra", price: 2.5 }]),
  dish("poke-wave", "salmao", "Poke de salmão", "Salmão, edamame, pepino, tarê.", 44.9, "/food/poke.jpg", "Bowls", true),
  dish("poke-wave", "veg", "Poke veg", "Tofu grelhado, manga, kale, gergelim.", 36.9, "/food/poke.jpg", "Bowls"),
  dish("poke-wave", "monte", "Monte o seu", "Base + 1 proteína + 4 toppings da casa.", 46.0, "/food/poke.jpg", "Bowls"),
  dish("poke-wave", "cha", "Chá gelado de lychee", "Lychee, hortelã, gelo.", 12.9, "/food/acai.jpg", "Bebidas", false, []),

  dish("casa-do-feijao", "feijoada", "Feijoada completa", "Feijão, carnes, arroz, couve, laranja, farofa, torresmo.", 54.9, "/food/feijoada.jpg", "Pratos", true, [DRINK, DESSERT, CUTLERY]),
  dish("casa-do-feijao", "pf", "PF do dia", "Arroz, feijão, bife, ovo, salada, farofa.", 32.9, "/food/feijoada.jpg", "Pratos", true),
  dish("casa-do-feijao", "strogonoff", "Strogonoff de frango", "Arroz, batata palha, molho cremoso.", 36.9, "/food/feijoada.jpg", "Pratos"),
  dish("casa-do-feijao", "virado", "Virado à paulista", "Tutu, bisteca, ovo, banana, couve.", 38.9, "/food/feijoada.jpg", "Pratos"),
  dish("casa-do-feijao", "pudim", "Pudim de leite", "Fatia alta, calda de caramelo.", 14.9, "/food/cafe.jpg", "Doces", false, []),

  dish("ramen-do-tigre", "tonkotsu", "Tonkotsu clássico", "Caldo 18h, chashu, ovo, nori, cebolinha.", 52.9, "/food/sushi.jpg", "Ramen", true, [{ id: "chashu", name: "Chashu extra", price: 12 }, { id: "ovo", name: "Ovo extra", price: 6 }]),
  dish("ramen-do-tigre", "spicy", "Spicy miso", "Miso picante, carne moída, milho, manteiga.", 54.9, "/food/sushi.jpg", "Ramen", true),
  dish("ramen-do-tigre", "shoyu", "Shoyu ramen", "Caldo claro, menma, alga, ovo.", 48.9, "/food/sushi.jpg", "Ramen"),
  dish("ramen-do-tigre", "gyoza", "Gyoza (6un)", "Porco e alho-poró, molho ponzu.", 28.9, "/food/sushi.jpg", "Entradas"),
  dish("ramen-do-tigre", "edamame", "Edamame com flor de sal", "Vagem quente, sal defumado.", 16.9, "/food/poke.jpg", "Entradas", false, []),

  dish("cacau-canela", "brigadeiro", "Caixa 8 brigadeiros", "70% cacau, pistache, ninho e tradicional.", 36.9, "/food/cafe.jpg", "Doces", true, []),
  dish("cacau-canela", "ninho", "Bolo de leite ninho", "Fatia alta, creme de ninho, raspas.", 22.9, "/food/cafe.jpg", "Bolos", true),
  dish("cacau-canela", "brownie", "Brownie com sorvete", "Meio amargo, sorvete de baunilha.", 24.9, "/food/cafe.jpg", "Doces"),
  dish("cacau-canela", "pudim-choco", "Pudim de chocolate", "Creme alto, calda amarga.", 18.9, "/food/cafe.jpg", "Doces"),
  dish("cacau-canela", "cafe", "Café com petit gateau", "Petit quente, bola de creme, espresso.", 27.9, "/food/cafe.jpg", "Combos"),

  dish("arabesco", "wrap", "Wrap de falafel", "Homus, picles, tomate, tahine, pão saj.", 34.9, "/food/thai.jpg", "Wraps", true, [DRINK, SAUCE]),
  dish("arabesco", "esfiha", "Esfiha aberta (3un)", "Carne com limão, tomate, hortelã.", 29.9, "/food/thai.jpg", "Esfihas", true),
  dish("arabesco", "kibe", "Kibe frito (4un)", "Trigo, carne, hortelã, coalhada.", 26.9, "/food/burger.jpg", "Salgados"),
  dish("arabesco", "homus", "Homus com pão", "Grão-de-bico, azeite, páprica, saj.", 22.9, "/food/thai.jpg", "Entradas"),
  dish("arabesco", "baklava", "Baklava (3un)", "Nozes, pistache, calda de flor de laranjeira.", 19.9, "/food/cafe.jpg", "Doces", false, []),

  dish("coxinha-da-esquina", "kit6", "Kit 6 coxinhas", "Frango com catupiry, massa fina.", 27.9, "/food/burger.jpg", "Salgados", true, [DRINK, SAUCE]),
  dish("coxinha-da-esquina", "kit12", "Kit 12 coxinhas", "A clássica da esquina, pra galera.", 49.9, "/food/burger.jpg", "Salgados", true, [DRINK]),
  dish("coxinha-da-esquina", "bolinho", "Bolinho de bacalhau (6un)", "Crocante por fora, alho e salsa.", 32.9, "/food/burger.jpg", "Salgados"),
  dish("coxinha-da-esquina", "enroladinho", "Enroladinho de salsicha (8un)", "Massa de padaria, mostarda.", 24.9, "/food/burger.jpg", "Salgados"),
  dish("coxinha-da-esquina", "caldo", "Caldo de pinhão", "Copo 400ml, inverno o ano inteiro.", 14.9, "/food/feijoada.jpg", "Caldos", false, []),

  dish("mercado-pediu", "banana", "Banana prata 1kg", "Madura no ponto de vitamina.", 8.9, "/food/acai.jpg", "Hortifruti", true, []),
  dish("mercado-pediu", "tomate", "Tomate italiano 500g", "Para molho ou salada.", 7.5, "/food/feijoada.jpg", "Hortifruti", false, []),
  dish("mercado-pediu", "alface", "Alface americana", "Hidropônica, crocante.", 5.9, "/food/poke.jpg", "Hortifruti", false, []),
  dish("mercado-pediu", "leite", "Leite integral 1L", "Caixinha, validade longa.", 5.49, "/food/cafe.jpg", "Laticínios", true, []),
  dish("mercado-pediu", "queijo", "Queijo minas 400g", "Fresco, meia-cura leve.", 18.9, "/food/cafe.jpg", "Laticínios", false, []),
  dish("mercado-pediu", "pao", "Pão de forma", "12 fatias, fermentação longa.", 9.9, "/food/cafe.jpg", "Padaria", true, []),
  dish("mercado-pediu", "ovos", "Ovos caipira (12un)", "Gema alta, caixa fechada.", 16.9, "/food/cafe.jpg", "Mercearia", false, []),
  dish("mercado-pediu", "cafe-grao", "Café em grãos 250g", "Torra média, notes de cacau.", 28.9, "/food/cafe.jpg", "Mercearia", false, []),
  dish("mercado-pediu", "refri", "Refrigerante 2L", "Gelado no centro de distribuição.", 10.9, "/food/burger.jpg", "Bebidas", false, []),
  dish("mercado-pediu", "chocolate", "Chocolate 70% 80g", "Amargo, origin Brazil.", 12.5, "/food/cafe.jpg", "Mercearia", false, []),
];

export const COURIERS = [
  { name: "Camila Souza", vehicle: "Moto Flash", plate: "RFL-0A99", rating: 4.97, trips: 1840, hue: 12 },
  { name: "Rafael Lima", vehicle: "Moto 99", plate: "QWE-9B12", rating: 4.92, trips: 2210, hue: 32 },
  { name: "Thiago Alves", vehicle: "Bike Flash", plate: "BIKE-04", rating: 4.99, trips: 640, hue: 200 },
  { name: "Jéssica Rocha", vehicle: "Moto Flash", plate: "JSC-4412", rating: 4.95, trips: 1102, hue: 340 },
  { name: "Bruno Nunes", vehicle: "Moto 99", plate: "BRN-7781", rating: 4.9, trips: 980, hue: 160 },
];

export type Promo = {
  id: string;
  kicker: string;
  title: string;
  subtitle: string;
  image: string;
  to: "/" | "/search" | "/market" | "/taste" | "/club";
  q?: string;
  tone: "primary" | "accent" | "ink";
};

export const PROMOS: Promo[] = [
  {
    id: "flash",
    kicker: "Flash 99",
    title: "Chega em 15 min",
    subtitle: "Motos livres agora na Consolação",
    image: "/food/burger.jpg",
    to: "/search",
    q: "flash",
    tone: "accent",
  },
  {
    id: "cupom",
    kicker: "PEDIU10",
    title: "10% na primeira sacola",
    subtitle: "Válido acima de R$ 40",
    image: "/food/pizza.jpg",
    to: "/search",
    tone: "primary",
  },
  {
    id: "mercado",
    kicker: "Mercado",
    title: "Relâmpago 25 min",
    subtitle: "Leite, pão e banana agora",
    image: "/food/feijoada.jpg",
    to: "/market",
    tone: "ink",
  },
  {
    id: "sabor",
    kicker: "Sabor",
    title: "O que pedir agora?",
    subtitle: "A fome escolhe o cardápio",
    image: "/food/acai.jpg",
    to: "/taste",
    tone: "primary",
  },
];

export const JUNTO = [
  { id: "mari", name: "Mari", initial: "M" },
  { id: "joao", name: "João", initial: "J" },
];

export const CANNED_REPLIES = [
  "Pode deixar na portaria",
  "Já estou descendo",
  "Tô no portão",
];

export const TIP_OPTIONS = [0, 2, 5, 8] as const;

export function hoursFor(flash: boolean) {
  return flash ? "Aberto 24h · Flash" : "10:00 – 23:30";
}

export function isOpenNow(flash: boolean, at: Date = new Date()) {
  if (flash) return true;
  const mins = at.getHours() * 60 + at.getMinutes();
  return mins >= 10 * 60 && mins <= 23 * 60 + 30;
}

export function clubTier(points: number) {
  if (points >= 800) return { id: "flash" as const, name: "Flash 99", next: null as number | null, perk: "Entrega grátis nos Flash" };
  if (points >= 250) return { id: "prata" as const, name: "Prata", next: 800, perk: "1,2× pontos em todo pedido" };
  return { id: "inicio" as const, name: "Pediu", next: 250, perk: "Cupom de boas-vindas" };
}

export function shownRating(base: number, reviewCount: number, userRating?: number) {
  if (!userRating) return { score: base, count: reviewCount };
  const score = Math.round(((base * reviewCount + userRating) / (reviewCount + 1)) * 10) / 10;
  return { score, count: reviewCount + 1 };
}

export function shownFee(fee: number, flash: boolean, points: number) {
  if (flash && clubTier(points).id === "flash") return 0;
  return fee;
}

export type TasteMood = {
  id: string;
  title: string;
  subtitle: string;
  tags: string[];
  cuisines: string[];
};

export const TASTE_MOODS: TasteMood[] = [
  { id: "braba", title: "Fome braba", subtitle: "Prato fundo, sem enrolação.", tags: ["feijoada", "picanha", "strogonoff"], cuisines: ["Brasileira", "Churrasco", "Lanches"] },
  { id: "conforto", title: "Conforto", subtitle: "Massa, caldo, abraço.", tags: ["massa", "ramen", "pudim"], cuisines: ["Italiana", "Japonesa", "Brasileira"] },
  { id: "leve", title: "Leve", subtitle: "Tigela, folha, frescor.", tags: ["poke", "açaí", "salada"], cuisines: ["Saudável", "Poke"] },
  { id: "festa", title: "Pra galera", subtitle: "Pizza, kit, combo.", tags: ["pizza", "coxinha", "combo"], cuisines: ["Pizza", "Salgados", "Lanches"] },
  { id: "madruga", title: "Madrugada", subtitle: "Flash, smash, coxinha.", tags: ["smash", "coxinha", "pizza"], cuisines: ["Lanches", "Salgados", "Pizza"] },
  { id: "doce", title: "Só um doce", subtitle: "Brigadeiro resolve.", tags: ["brigadeiro", "bolo", "açaí"], cuisines: ["Doces", "Saudável", "Padaria"] },
];

export const FLASH_DEALS = [
  { restaurantId: "smash-club", off: 20, dish: "Double smash" },
  { restaurantId: "acai-do-parque", off: 15, dish: "Tigela 500 ml" },
  { restaurantId: "coxinha-da-esquina", off: 12, dish: "Kit 6 coxinhas" },
  { restaurantId: "padaria-lume", off: 10, dish: "Combo manhã" },
] as const;

export const REFERRAL_CODE = "PEDIUVCE";

export const HELP_TOPICS = [
  {
    id: "pedido",
    title: "Pedido",
    items: [
      {
        q: "Posso cancelar?",
        a: "Até a cozinha confirmar, cancela em Pedidos. Depois disso, fala com a moto no chat — ela devolve se ainda não saiu.",
      },
      {
        q: "Atraso Flash 99",
        a: "Se passar de 22 min no Flash, a taxa some na hora e cai um cupom de R$ 5 na carteira.",
      },
      {
        q: "Pedir de novo",
        a: "Em Pedidos anteriores, toque em Pedir de novo. A sacola volta com os extras e observações.",
      },
    ],
  },
  {
    id: "entrega",
    title: "Entrega e moto",
    items: [
      {
        q: "Onde está a moto?",
        a: "Abre o pedido ao vivo. O radar da 99 desenha a rua Augusta até a sua porta, com placa e nota do entregador.",
      },
      {
        q: "Chat e ligação",
        a: "No pedido em andamento: Chat pra texto, Ligar pra urgência. A moto responde com frases prontas.",
      },
      {
        q: "Gorjeta",
        a: "No checkout, de 0 a R$ 8. 100% vai pra quem está no guidão.",
      },
    ],
  },
  {
    id: "pay",
    title: "Pediu Pay e cupons",
    items: [
      {
        q: "O que é Pediu Pay?",
        a: "Carteira do app. Recarrega, paga o pedido e recebe 2% de cashback em todo Pediu.",
      },
      {
        q: "Cupom não aplica",
        a: "PEDIU10 pede R$ 40. FLASH99 só em restaurante Flash. PIX5 só no Pix. FOME20 a partir de R$ 59.",
      },
      {
        q: "Pontos do Clube",
        a: "R$ 1 vira 1 ponto. Troca 100 pts por R$ 8 na carteira, na aba Clube.",
      },
    ],
  },
  {
    id: "mercado",
    title: "Mercado",
    items: [
      {
        q: "Quanto demora?",
        a: "Mercado Pediu sai em até 25 min, na mesma moto Flash da Consolação.",
      },
      {
        q: "Pode misturar com comida?",
        a: "A sacola é de um lugar por vez. Se misturar, a gente pergunta se troca.",
      },
    ],
  },
];

export function getRestaurant(id: string) {
  return RESTAURANTS.find((r) => r.id === id);
}

export function getDish(id: string) {
  return DISHES.find((d) => d.id === id);
}

export function dishesOf(restaurantId: string) {
  return DISHES.filter((d) => d.restaurantId === restaurantId);
}

export function restaurantOfDish(dishId: string) {
  const d = getDish(dishId);
  return d ? getRestaurant(d.restaurantId) : undefined;
}

export function getAddress(id: string) {
  return ADDRESSES.find((a) => a.id === id) ?? ADDRESSES[0];
}

export function getCoupon(code: string) {
  return COUPONS.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
}

export function popularDishes() {
  return DISHES.filter((d) => d.popular);
}

export function flashRestaurants() {
  return RESTAURANTS.filter((r) => r.flash);
}

export function restaurantsByCuisine(cuisine: string) {
  return RESTAURANTS.filter((r) => r.cuisine === cuisine);
}

export function searchAll(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return { restaurants: [] as Restaurant[], dishes: [] as Dish[] };
  const restaurants = RESTAURANTS.filter((r) => {
    const hay = `${r.name} ${r.cuisine} ${r.neighborhood} ${r.tags.join(" ")}`.toLowerCase();
    return hay.includes(q);
  });
  const dishes = DISHES.filter((d) => {
    const hay = `${d.name} ${d.description} ${d.category}`.toLowerCase();
    return hay.includes(q);
  });
  return { restaurants, dishes };
}

export function collectionsForHour(hour: number) {
  if (hour < 11) return { title: "Café da manhã", ids: ["padaria-lume", "acai-do-parque", "cacau-canela"] };
  if (hour < 15) return { title: "Almoço na hora", ids: ["casa-do-feijao", "poke-wave", "thai-siam", "nonna-rosa"] };
  if (hour < 18) return { title: "Lanche da tarde", ids: ["acai-do-parque", "coxinha-da-esquina", "padaria-lume"] };
  if (hour < 23) return { title: "Jantar sem fila", ids: ["napoli-di-roma", "nikkei-88", "brasa-da-vila", "ramen-do-tigre"] };
  return { title: "Madruga Flash", ids: ["smash-club", "coxinha-da-esquina", "napoli-di-roma"] };
}

export function applyCoupon(code: string | null, subtotal: number, deliveryFee: number, isFlash: boolean, payment: string) {
  if (!code) return { discount: 0, deliveryFee, label: null as string | null };
  const coupon = getCoupon(code);
  if (!coupon || subtotal < coupon.min) return { discount: 0, deliveryFee, label: null };
  if (coupon.code === "PIX5" && payment !== "pix") return { discount: 0, deliveryFee, label: null };
  if (coupon.type === "delivery") {
    if (coupon.code === "FLASH99" && !isFlash) return { discount: 0, deliveryFee, label: null };
    return { discount: 0, deliveryFee: 0, label: coupon.label };
  }
  if (coupon.type === "percent") {
    return { discount: Math.round(subtotal * (coupon.value / 100) * 100) / 100, deliveryFee, label: coupon.label };
  }
  return { discount: Math.min(coupon.value, subtotal), deliveryFee, label: coupon.label };
}

export function reviewsFor(id: string) {
  const pool: Record<string, { name: string; text: string; rating: number }[]> = {
    "brasa-da-vila": [
      { name: "Marina", text: "Picanha no ponto. Parecia restaurante, não delivery.", rating: 5 },
      { name: "Leo", text: "Farofa de ovos absurda. Só atrasou 8 minutos.", rating: 4 },
    ],
    "napoli-di-roma": [
      { name: "Giulia", text: "A borda é o motivo de pedir. Massa leve.", rating: 5 },
      { name: "Pedro", text: "Chegou quente, manjericão ainda vivo.", rating: 5 },
    ],
    "smash-club": [
      { name: "Caio", text: "15 minutos. Carne com borda crocante de verdade.", rating: 5 },
      { name: "Bia", text: "Melhor smash da Augusta. Batata precisa de mais sal.", rating: 4 },
    ],
  };
  return (
    pool[id] ?? [
      { name: "Ana", text: "Pedido certo, embalagem boa, sabor no ponto.", rating: 5 },
      { name: "Rafa", text: "Virou o padrão da casa. Sempre peço de novo.", rating: 5 },
    ]
  );
}
