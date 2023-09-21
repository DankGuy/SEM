import { Skeleton } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";

function StaffInCategory(props) {
    const [loaded, setLoaded] = useState(false);

    const imgStyle = {
        // display: loaded ? 'block' : 'none'
        display: loaded ? 'block': 'none'
    }

    const handleImageLoad = () => {
        console.log("loaded")
        if(!loaded) {
            setLoaded(true);
        }
    }

    console.log("loaded: " + loaded)

    return (
        <div key={props.staff.id} className={'collapseContent'}>
            <Link to={`staff?id=${props.staff.id}`} state={'a'}>
                { !loaded && <Skeleton.Image active />}
                <img src={props.staff.imageUrl} alt='Staff' style={imgStyle} onLoad={handleImageLoad()}/>
                <h4>{props.staff.name}</h4>
                <p>{props.staff.contact}</p>
            </Link>
        </div>
    )
}

export default StaffInCategory