import { Collapse } from 'antd';
import './StaffCategory.css'
import { Link } from 'react-router-dom';

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
            return (
                <div key={staff.id} className={'collapseContent'}>
                    <Link to={`staff?id=${staff.id}`} state={'a'}>
                        <img src={staff.imageUrl} alt='Staff'/>
                        <h4>{staff.name}</h4>
                        <p>{staff.contact}</p>
                    </Link>
                </div>
            )}
        )

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