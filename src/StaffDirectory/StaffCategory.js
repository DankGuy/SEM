import { Collapse } from 'antd';
import './StaffCategory.css'
import StaffInCategory from './StaffInCategory';

function StaffCategory(props) {
    
    if(props.department === undefined || props.staff === undefined) {
        return (
            <div></div>
        )
    }
    const categories = props.department.map((department) => {
        // only the staff that is in each department
        const departmentStaff = props.staff.filter((staff) => staff.departmentid.search(department.id))
        const staffInDepartment = departmentStaff.map((staff) => {
            return <StaffInCategory key={staff.id} staff={staff} />
        })

        return(
            {
                key: department.id,
                label: department.department,
                children: 
                    <div className={'collapseContentContainer'}>
                        {staffInDepartment}
                    </div>
            }
        )
    })

    return (
        <div>
            <Collapse accordion items={categories} />
        </div>
        )
}
  
export default StaffCategory