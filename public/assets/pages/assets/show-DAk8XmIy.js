import{h as e}from"./general-DAK3ebw_.js";function t(){e(".content"),$("#showContainer").load(`${_baseURL}/inventories/other-devices/${_id}/view`,()=>{e(".content",!1),_globaVar.tabIdActive&&($(_globaVar.tabIdActive).click(),delete _globaVar.tabIdActive)})}document.addEventListener("DOMContentLoaded",function(){document.getElementById("refresh").addEventListener("click",()=>t()),t()});