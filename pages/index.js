import { AiOutlinePlus } from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";
import { GoSignOut } from "react-icons/go";
import { useAuth } from "../firebase/auth";
import { useRouter } from "next/router";
import Loader from "../component/loader";
import { useEffect,useState } from "react";
import {
    collection,
    addDoc,
    getDocs,
    where,
    query,
    deleteDoc,
    updateDoc,
    doc,
} from "firebase/firestore";
import {db} from "../firebase/firebase";



export default function Home() {
    const {authUser,isLoading,signOut}=useAuth();
const [todoInput,settodoInput]=useState("");
const [todos,settodos]=useState({});


    const router=useRouter()

    useEffect(()=>{
    if(!isLoading && !authUser){
    router.push("/login")
    }

if(!!authUser){
fetchToDo(authUser.uid);
}

    },[authUser,isLoading]);


const addToDo=async ()=>{
    try {
        const docRef = await addDoc(collection(db, "todo"), {
            owner:authUser.uid,
            content:todoInput,
            completed:false
          });
          console.log("Document written with ID: ", docRef.id);
          fetchToDo(authUser.uid);
          settodoInput("");
    } catch (error) {
        console.error(error)
    }

}

const deleteTodo =async (docId)=>{
   try {
    await deleteDoc(doc(db,"todo",docId))
    fetchToDo(authUser.uid);
   } catch (error) {
    console.error(error)
   }
}
 
const fetchToDo=async (uid)=>{
    try {
        const q = query(collection(db, "todo"), where("owner", "==", uid));

const querySnapshot = await getDocs(q);
let data=[]
querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  data.push({...doc.data(),id:doc.id})
});


settodos(data)
    } catch (error) {
        console.error(error)
    }
}

const mark=async (event,docId)=>{
    try {
        const docRef=doc(db,"todo",docId);
        await updateDoc(docRef,{
            completed:event.target.checked
        })
        fetchToDo(authUser.uid);
    } catch (error) {
        console.error(error)
    }
}

const onKeyPress =(event)=>{
    if(event.key ==="Enter" && todoInput.length>0){
        addToDo();
    }
}

    return !authUser ?<Loader/>: (
        <main className="">
            <div className="bg-red-500 text-white w-44 py-4 mt-10 rounded-lg transition-transform hover:bg-red-600 active:scale-90 flex items-center justify-center gap-2 font-medium shadow-md fixed bottom-5 right-5 cursor-pointer" onClick={signOut}>
                <GoSignOut size={18} />
                <span>Logout</span>
            </div>
            <div className="max-w-3xl mx-auto  p-8">
                <div className="bg-white -m-6 p-3 sticky top-0">
                    <div className="flex justify-center flex-col items-center">
                       <span className="text-3xl">Welcome {authUser.username}!</span>
                        <h1 className="text-5xl md:text-7xl font-bold">
                            To Do list.
                        </h1>
                    </div>
                    <div className="flex items-center gap-2 mt-10">
                        <input
                            placeholder={`What to do?`}
                            type="text"
                            className="font-semibold placeholder:text-gray-500 border-[2px] border-black h-[60px] grow shadow-sm rounded-md px-4 focus-visible:outline-yellow-400 text-lg transition-all duration-300"
                            autoFocus
                            value={todoInput}
                            onChange={(e)=>settodoInput(e.target.value)}
                            onKeyUp={onKeyPress}
                        />
                        <button className="w-[60px] h-[60px] rounded-md bg-lime-500 flex justify-center items-center cursor-pointer transition-all duration-300 hover:bg-lime-600" onClick={addToDo}>
                            <AiOutlinePlus size={30} color="#fff" />
                        </button>
                    </div>
                </div>
                <div className="my-10">
                     {todos.length>0 && todos.map((todo, index) => (
                        <div key={todo.id} className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-3">
                                <input
                                    id={`todo-${todo.id}`}
                                    type="checkbox"
                                    className="w-4 h-4 accent-lime-500 rounded-lg"
                                    checked={todo.completed}
                                   onChange={(e)=>mark(e,todo.id)}
                                />
                                <label
                                    htmlFor={`todo-${todo.id}`}
                                    className={`font-medium ${
                                        todo.completed ?"line-through" : ''
                                    }`}
                                >
                                    {todo.content}
                                </label>
                            </div>

                            <div className="flex items-center gap-3">
                                <MdDeleteForever
                                    size={24}
                                    className="text-red-400 hover:text-red-600 cursor-pointer"
                                onClick={()=>deleteTodo(todo.id)}/>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
