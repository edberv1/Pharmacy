import ContactTable from "../components/ContactTable"
import ContactChart from "../ContactChart"

function Contacts() {
  return (
    <div className="w-full pl-8">
      <ContactChart/>
      <ContactTable/>
    </div>
  )
}

export default Contacts
