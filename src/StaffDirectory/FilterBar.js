import { Form, Select } from 'antd';

const { Option } = Select;

function getOptions (filterData) {
    const options = filterData.map((data) => {
        return <Option key={data.id} value={data.id}>{data.filterdata}</Option>
    })

    return options
}

function FilterBar(props) {
    const options = getOptions(props.filterObject.filterData)
    
    return (
        <Form.Item 
        name={props.filterObject.filterType} 
        label={"Filter by " + props.filterObject.filterType} 
        rules={[
            {
                required: false,
                type: 'array',
            },
        ]}>
            <Select mode="multiple" placeholder={props.filterObject.filterType}>
                {options}
            </Select>
        </Form.Item>
    )
}

export default FilterBar