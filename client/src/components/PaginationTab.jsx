import React,{useState} from "react";
import { useNavigate } from "react-router-dom";

export default function PaginationTab(props){
    const [button,setButton]=useState(props.currentPage);
    function activeButton(page){
        setButton(page)
        props.changePage(page);
    }
    function nextPage(){
        if(button+1<=props.numberOfPages){
            activeButton(button+1);
        }
    }
    function previousPage(){
        if(button-1>=1){
            activeButton(button-1);
        }
    }
    let pages=[];
    for(let i=1;i<=props.numberOfPages;i++){
        pages.push(i);
    }
    return(
        <div className="paginationTab">
            <button onClick={previousPage}>&lt;</button>
            {pages.map((page)=>{
                return(
                    <button key={page} onClick={()=>{activeButton(page)}} className={button==page && "paginationButtonActive"} >{page}</button>
                )
            }
            )
            }
            <button onClick={nextPage}>&gt;</button>
        </div>
    )
}