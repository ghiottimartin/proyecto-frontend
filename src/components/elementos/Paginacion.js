import React from "react";

//Librería
import Pagination from "react-js-pagination";

//CSS
import "../../assets/css/Elementos/Paginacion.css";

class Paginacion extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var props = this.props;
        return (
            <div className="d-flex justify-content-center align-items-center">
                <Pagination
                    activePage={props.activePage}
                    itemsCountPerPage={props.itemsCountPerPage}
                    totalItemsCount={props.totalItemsCount}
                    pageRangeDisplayed={props.pageRangeDisplayed}
                    onChange={props.onChange}
                    prevPageText={"..."}
                    nextPageText={"..."}
                    firstPageText={"<"}
                    lastPageText={">"}
                    itemClassLast={"previous"}
                    itemClassFirst={"first"}
                />
            </div>
        )
    }
}

export default Paginacion;