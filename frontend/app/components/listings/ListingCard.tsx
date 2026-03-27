import { BsShopWindow } from "react-icons/bs";
import { FiMapPin, FiShoppingBag } from "react-icons/fi";

const ListingCard = ({ item }: any) => {
    return (
        <div key={item.id} className="group border bg-white border-nebular-yellow transition-all overflow-hidden">
            <div className="aspect-video bg-gray-100 relative overflow-hidden h-60">
                <img src={item.image || 'https://via.placeholder.com/400'} className="w-full h-full object-cover" />
                {/* <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest">{item.category}</div> */}
            </div>

            <div className="p-2 space-y-2 text-left space-y-4">
                <div className="flex space-x-3">
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded border ${item.status === 'Active' ? 'border-green-500 text-green-600 bg-green-50' :
                        item.status === 'Sold' ? 'border-gray-500 text-gray-600 bg-gray-50' :
                            'border-yellow-600 text-yellow-700 bg-yellow-50'
                        }`}>
                        {item.category}
                    </span>

                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded border border-green-500 text-green-600 bg-green-50`}>
                        {item.category}
                    </span>
                </div>
                <div className="text-black space-y-2">
                    <h3 className=" ">{item.title}</h3>
                    <p className="text-gray-600 text-xs">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>

                    <div className="flex items-center justify-between text-sm w-full">
                        <p className="font-black tracking-tighter">${item.price}</p>
                        <div className="space-x-3 flex items-center">
                            <FiMapPin />
                            Blantyre, Chichiri
                        </div>
                        <button onClick={() => () => { }} className="flex border-nebular-yellow space-x-2 items-center p-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-500 hover:text-white transition-all">
                            <BsShopWindow />
                            <span>View Shop </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ListingCard;