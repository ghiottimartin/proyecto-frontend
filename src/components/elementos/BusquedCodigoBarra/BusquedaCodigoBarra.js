import React, { useEffect, useRef, useState } from 'react'

import './BusquedaCodigoBarra.css'

const BusquedaCodigoBarra = (props) => {
    const { buscarProducto } = props

    const searchInput = useRef(null);
    
    useEffect(() => {
        searchInput.current.focus();
    }, [])

    const [focused, setFocused] = useState(true)
    const [codigo, setCodigo] = useState('')
    const placeholder = focused ? 'Lea el código con la lectora' : 'Haga click para buscar producto por código'

    const onFocus = () => setFocused(true)
    const onBlur = () => setFocused(false)
    
    const onChange = (e) => {
        const actual = e.target.value
        setCodigo(actual)
        const encontrado = buscarProducto(actual)
        if (encontrado) {
            setCodigo('')
            setFocused(true)
        }        
    }
    
    return (
        <div className="busqueda-codigo-barra">
            <input ref={searchInput} type="text" value={codigo} onChange={(e) => onChange(e)} placeholder={placeholder} onFocus={onFocus} onBlur={onBlur} />
        </div>
    )
}

export default BusquedaCodigoBarra