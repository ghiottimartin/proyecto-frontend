 export function getIconoConId(e) {
    const target = e.target
    const icono = target.closest("[data-id]");
    if (icono) {
        return icono
    }
    return target
}