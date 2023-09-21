import { Form, Input, Space, Button, Skeleton } from 'antd';
import FilterBar from './FilterBar';

function getFilters(filterObject, i) {
    if(filterObject.filterData === null){
        return(
            <div key={i}>
                <Skeleton.Input active style={{marginBottom:30, width:400}}/>
                <br/>
            </div>
        )
    }
    return <FilterBar key={i} filterObject={ filterObject }/>
}


function SearchBar(props) {
    let i = 0
    const filters = props.filterObjectArr.map((filterObject) => {
        return getFilters(filterObject, i++)
    }) 

    return (
        <div>
            <Form onFinish={(values) => {props.onSearch(values)}}>
                { filters }
                <Form.Item name={"Name"}>
                    <Input placeholder="Name" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Search
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default SearchBar