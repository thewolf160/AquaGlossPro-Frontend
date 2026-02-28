import type { TableProps, ColumnsProps } from "./Table.types";
import type { Item } from "../../types/models";

function Table({
  columns,
  data,
  onDelete,
  onEdit,
  onView,
  emptyMessage = "No hay datos para mostrar",
}: TableProps) {
  if (data.length === 0) {
    return <div>{emptyMessage}</div>;
  }

  return (
    <>
      <div className="overflow-x-auto bg-white">
        <table className="table table-auto">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((col: ColumnsProps) => (
                <th
                  className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  key={col.key}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((item: Item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                {columns.map((col: ColumnsProps) => (
                  <td key={col.key} className="px-6 py-3 text-center">
                    {col.render ? (
                      col.render(item)
                    ) : col.key === "actions" ? (
                      onDelete || onEdit || onView ? (
                        <div className="flex justify-center items-center">
                          {onView && (
                            <button
                              className="text-blue-600 hover:text-blue-800 transition-all cursor-pointer px-2 py-1"
                              onClick={() => onView(item)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="19"
                                height="19"
                                fill="currentColor"
                                className="bi bi-eye"
                                viewBox="0 0 16 16"
                              >
                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                              </svg>
                            </button>
                          )}
                          {onEdit && (
                            <button
                              className="text-gray-700 hover:text-gray-800 cursor-pointer transition-all px-2 py-1"
                              onClick={() => onEdit(item)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="19"
                                height="19"
                                fill="currentColor"
                                className="bi bi-pencil"
                                viewBox="0 0 16 16"
                              >
                                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                              </svg>
                            </button>
                          )}
                          {onDelete && (
                            <button
                              className="text-red-600 hover:text-red-700 transition-all cursor-pointer px-2 py-1"
                              onClick={() => onDelete(item)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="19"
                                height="19"
                                fill="currentColor"
                                className="bi bi-trash"
                                viewBox="0 0 16 16"
                              >
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ) : null
                    ) : (
                      (item as any)[col.key]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Table;
