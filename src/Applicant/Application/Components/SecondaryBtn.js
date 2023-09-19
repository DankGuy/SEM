import { Button } from "antd";

function SecondaryBtn({ name, onClick, onHover, disable}){

    return(
        <Button
            type="primary"
            style={
                {
                    backgroundColor: "#FFFFFF",
                    color: "#1890ff",
                    border: "1px solid #1890ff",
                    borderRadius: "5px",
                }
            }
            onClick={onClick}
            disabled={disable}
        >
            {name}
        </Button>
    );
}


export default SecondaryBtn;