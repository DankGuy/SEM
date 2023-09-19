import { Button } from "antd";

function PrimaryBtn({ name, onClick, style, onHover, disable }){

    return(
        <Button
            type="primary"
            style={style}
            onClick={onClick}
            disabled={disable}
        >
            {name}
        </Button>
    );
}


export default PrimaryBtn;