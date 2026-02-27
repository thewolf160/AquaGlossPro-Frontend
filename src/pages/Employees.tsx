import Table from "../components/Table/Table";
import type { Item } from "../types/models";

function Employees() {
  const columns = [
    {key: "name", header: "Nombre"},
    {key: "lastname", header: "Apellido"},
    {key: "actions", header: "Acciones"}
  ]

  const handleDelete = (item: Item) => {
    console.log(item.name)
  }

  const handleEdit = (item: Item) => {
    console.log(`Restaurar a ${item.name}`)
  }

  const data = [
    {id: 1, name: "Yonathan", lastname: "Nieles"},
    {id: 2, name: "Jesus", lastname: "Cortez"}
  ]
  return (
    <>
    <div className="p-10">
      <Table columns={columns} data={data} onDelete={handleDelete} onEdit={handleEdit}/>
    </div>
      
    </>
  );
}

export default Employees;
