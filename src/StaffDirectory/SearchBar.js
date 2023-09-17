import { Form, Input, Space, Button } from 'antd';
import FilterBar from './FilterBar';

function getFilters(filterObject, i) {
    if(filterObject.filterData === null) return
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
                {filters}
                <Form.Item name={"Name"}>
                    <Input placeholder="Name" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Search
                    </Button>
                </Form.Item>

                {/* <Space direction='vertical' style={{width:400}}>
                    <Search placeholder="" allowClear enterButton="Search" size="large" htmltype="submit"
                    onSearch={(value) => {
                        console.log(value)
                        props.onSearch(value)
                    }}/>
                </Space> */}
            </Form>
        </div>
    )
}

export default SearchBar