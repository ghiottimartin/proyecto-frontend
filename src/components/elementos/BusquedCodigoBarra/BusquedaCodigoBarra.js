import React, { useState } from 'react'

import './BusquedaCodigoBarra.css'

const BusquedaCodigoBarra = (props) => {
    const { buscarProducto } = props
    const [codigo, setCodigo] = useState('')
    const [focused, setFocused] = useState(false)
    const onFocus = () => setFocused(true)
    const onBlur = () => setFocused(false)
    const placeholder = focused ? 'Lea el código con la lectora' : 'Haga click para buscar producto por código'

    const onChange = (e) => {
        const actual = e.target.value
        setCodigo(actual)
        const encontrado = buscarProducto(actual)
        if (encontrado) {
            setCodigo('')
        }
        
    }
    return (
        <div className="busqueda-codigo-barra">
            <input type="text" value={codigo} onChange={(e) => onChange(e)} placeholder={placeholder} onFocus={onFocus} onBlur={onBlur} />
        </div>
    )
}

export default BusquedaCodigoBarra