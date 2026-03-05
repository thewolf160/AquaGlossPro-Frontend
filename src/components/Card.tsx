interface CardProps{
    title: string;
    text: string;
    price: string;
}

function Card({title, text, price}:CardProps){
    return(
        <>
        <div className="card bg-white shadow-sm hover:shadow-lg transition-all ease-in min-w-65 max-w-80 border  border-slate-200">
            <figure className="bg-linear-to-br from-blue-200 to-blue-300 p-18 m-4 rounded-md">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="currentColor"
                className="bi bi-car-front-fill text-blue-800"
                viewBox="0 0 16 16"
              >
                <path d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679q.05.242.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.8.8 0 0 0 .381-.404l.792-1.848ZM3 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2m10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2M6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2zM2.906 5.189a.51.51 0 0 0 .497.731c.91-.073 3.35-.17 4.597-.17s3.688.097 4.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 11.691 3H4.309a.5.5 0 0 0-.447.276L2.906 5.19Z" />
              </svg>
            </figure>
            <div className="card-body">
                <h2 className="card-title font-bold text-slate-800 text-2xl">{title}</h2>
                <p className="text-md text-slate-500">{text}</p>
                <div className="card-actions flex items-center">
                    <p className="text-xl font-medium text-blue-600">{price}</p>
                    <button className="px-2 py-1 hover:bg-blue-200 bg-blue-100 rounded-full text-blue-800 shadow-sm cursor-pointer transition-all ease-in"><i className="bi bi-plus text-xl"></i></button>
                </div>
            </div>
        </div>
        
        </>
    )
}

export default Card;