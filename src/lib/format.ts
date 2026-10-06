export function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatFee(value: number) {
  return value <= 0 ? "Grátis" : formatBRL(value);
}

export function formatRange(min: number, max: number) {
  return `${min}–${max} min`;
}

export function formatRemain(mins: number) {
  if (mins <= 0) return "agora";
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  const rest = mins % 60;
  if (rest === 0) return `${hours} h`;
  return `${hours} h ${rest} min`;
}

export function greetingForHour(hour: number) {
  if (hour < 5) return "Boa madrugada";
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export function hungerLine(hour: number) {
  if (hour < 5) return "O Pediu Flash ainda está na rua.";
  if (hour < 11) return "Pão de queijo ou açaí — você escolhe.";
  if (hour < 15) return "Almoço com cara de fim de semana.";
  if (hour < 18) return "Um lanche agora muda o dia.";
  if (hour < 23) return "Jantar sem fila, sem dúvida.";
  return "Madruga pede Flash. A gente corre.";
}

export function orderCode(id: string) {
  return id.replace("PD-", "#");
}
