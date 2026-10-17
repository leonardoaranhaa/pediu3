export const FEIRA_TOWN = "cidade pequena";

export const FEIRA_STOPS = [
  { id: "casa", label: "Casa", street: "Rua das Flores, 48", neighborhood: "Centro" },
  { id: "trabalho", label: "Trabalho", street: "Av. Brasil, 210", neighborhood: "Jardim" },
  { id: "mae", label: "Casa da mãe", street: "Travessa da Matriz, 7", neighborhood: "Estação" },
] as const;

export function getStop(id: string | null | undefined) {
  return FEIRA_STOPS.find((stop) => stop.id === id) ?? FEIRA_STOPS[0];
}

export type FeiraMarket = {
  id: string;
  name: string;
  keeper: string;
  street: string;
  neighborhood: string;
  blurb: string;
  image: string;
  fee: number;
  km: number;
  aisles: string[];
};

export type FeiraProduct = {
  id: string;
  marketId: string;
  name: string;
  unit: string;
  price: number;
  aisle: string;
  image: string;
};

export const FEIRA_MARKETS: FeiraMarket[] = [
  {
    id: "central",
    name: "Mercadinho Central",
    keeper: "Dona Íris",
    street: "Rua do Comércio, 40",
    neighborhood: "Centro",
    blurb: "Mercearia de balcão. Arroz, óleo e o que acaba no meio da semana.",
    image: "/food/feijoada.jpg",
    fee: 4.9,
    km: 1.2,
    aisles: ["Mercearia", "Frios", "Limpeza"],
  },
  {
    id: "nilo",
    name: "Hortifruti do Nilo",
    keeper: "Seu Nilo",
    street: "Av. das Palmeiras, 12",
    neighborhood: "Jardim",
    blurb: "Banca da manhã. Fruta pesada na hora, verdura ainda molhada.",
    image: "/food/acai.jpg",
    fee: 3.5,
    km: 0.8,
    aisles: ["Frutas", "Verduras", "Raízes"],
  },
  {
    id: "estacao",
    name: "Empório da Estação",
    keeper: "Lúcia",
    street: "Praça da Matriz, 8",
    neighborhood: "Estação",
    blurb: "Pão, frios e o bolo que sai depois das 15h.",
    image: "/food/cafe.jpg",
    fee: 5.9,
    km: 1.6,
    aisles: ["Padaria", "Frios", "Bebidas"],
  },
];

export const FEIRA_PRODUCTS: FeiraProduct[] = [
  p("central", "arroz", "Arroz tipo 1", "5 kg", 28.9, "Mercearia", "/food/feijoada.jpg"),
  p("central", "feijao", "Feijão carioca", "1 kg", 9.9, "Mercearia", "/food/feijoada.jpg"),
  p("central", "oleo", "Óleo de soja", "900 ml", 8.5, "Mercearia", "/food/pasta.jpg"),
  p("central", "acucar", "Açúcar cristal", "1 kg", 5.4, "Mercearia", "/food/cafe.jpg"),
  p("central", "leite", "Leite integral", "1 L", 5.49, "Frios", "/food/cafe.jpg"),
  p("central", "ovos", "Ovos brancos", "12 un", 16.9, "Frios", "/food/cafe.jpg"),
  p("central", "cafe", "Café torrado", "500 g", 18.9, "Mercearia", "/food/cafe.jpg"),
  p("central", "sabao", "Sabão em pó", "1 kg", 12.9, "Limpeza", "/food/poke.jpg"),

  p("nilo", "banana", "Banana prata", "1 kg", 7.9, "Frutas", "/food/acai.jpg"),
  p("nilo", "laranja", "Laranja pera", "1 dúzia", 9.5, "Frutas", "/food/acai.jpg"),
  p("nilo", "mamao", "Mamão formosa", "1 un", 8.9, "Frutas", "/food/acai.jpg"),
  p("nilo", "tomate", "Tomate maduro", "1 kg", 8.4, "Verduras", "/food/thai.jpg"),
  p("nilo", "alface", "Alface crespa", "1 pé", 4.5, "Verduras", "/food/poke.jpg"),
  p("nilo", "cheiro", "Cheiro-verde", "1 maço", 3.5, "Verduras", "/food/poke.jpg"),
  p("nilo", "batata", "Batata asterix", "1 kg", 6.9, "Raízes", "/food/feijoada.jpg"),
  p("nilo", "cebola", "Cebola", "1 kg", 5.9, "Raízes", "/food/feijoada.jpg"),

  p("estacao", "pao", "Pão francês", "10 un", 9.0, "Padaria", "/food/cafe.jpg"),
  p("estacao", "bolo", "Bolo de fubá", "1 fatia", 8.5, "Padaria", "/food/cafe.jpg"),
  p("estacao", "queijo", "Queijo minas", "400 g", 22.9, "Frios", "/food/cafe.jpg"),
  p("estacao", "presunto", "Presunto fatiado", "200 g", 11.9, "Frios", "/food/burger.jpg"),
  p("estacao", "manteiga", "Manteiga", "200 g", 14.5, "Frios", "/food/cafe.jpg"),
  p("estacao", "requeijao", "Requeijão", "220 g", 9.9, "Frios", "/food/cafe.jpg"),
  p("estacao", "suco", "Suco de laranja", "1 L", 12.0, "Bebidas", "/food/acai.jpg"),
  p("estacao", "biscoito", "Biscoito de polvilho", "100 g", 6.5, "Padaria", "/food/cafe.jpg"),
];

export const HANDOFFS = [
  "Pode buscar agora",
  "Buscar no fim da tarde",
  "Ligar quando sair do mercado",
  "Deixar na portaria",
] as const;

export type Entregador = {
  id: string;
  name: string;
  vehicle: string;
  plate: string;
  rating: number;
  trips: number;
  hue: number;
  eta: string;
  fee: number;
};

export const ENTREGADORES: Entregador[] = [
  {
    id: "camila",
    name: "Camila Souza",
    vehicle: "CG 160",
    plate: "RFL-0A99",
    rating: 4.97,
    trips: 640,
    hue: 12,
    eta: "8 min até o mercado",
    fee: 6,
  },
  {
    id: "beto",
    name: "Beto Nunes",
    vehicle: "Biz",
    plate: "BTN-2210",
    rating: 4.91,
    trips: 410,
    hue: 200,
    eta: "na praça agora",
    fee: 5.5,
  },
  {
    id: "nina",
    name: "Nina Rocha",
    vehicle: "Moto 160",
    plate: "NNA-7781",
    rating: 4.95,
    trips: 280,
    hue: 42,
    eta: "12 min · bairro",
    fee: 7,
  },
];

export function getRider(id: string | null | undefined) {
  return ENTREGADORES.find((rider) => rider.id === id);
}

function p(
  marketId: string,
  slug: string,
  name: string,
  unit: string,
  price: number,
  aisle: string,
  image: string,
): FeiraProduct {
  return { id: `${marketId}-${slug}`, marketId, name, unit, price, aisle, image };
}

export function getMarket(id: string | null | undefined) {
  return FEIRA_MARKETS.find((market) => market.id === id);
}

export function productsOf(marketId: string) {
  return FEIRA_PRODUCTS.filter((item) => item.marketId === marketId);
}

export function getFeiraProduct(id: string) {
  return FEIRA_PRODUCTS.find((item) => item.id === id);
}
