import{f as r}from"./general-DAK3ebw_.js";let i=null,a=null,e=null;function c(){$("#keyword").on("keyup change",function(l){e=$(this).val().trim(),clearTimeout(i),i=setTimeout(function(){e!=null&&a!=e&&(a=e,o())},500)}),o()}async function o(){$(".indicator-progress").removeClass("d-none"),$("#itemListContainer").addClass("d-none"),$("#itemListContainer").html(null);const s=(await r(`${_baseURL}/s2/configs/helpdesks/ticket-templates?ticket_purpose=${purposeId}&keyword=${$("#keyword").val()}`,"GET",null)).data.data;if($(".indicator-progress").addClass("d-none"),$("#itemListContainer").removeClass("d-none"),s.length<=0)$("#itemListContainer").html(`
            <div class="d-flex flex-column align-items-center">
                <h1><i class="fas fa-question"></i></h1>
                <h1>Not found</h1>
                <p>Please use other keyword or you can leave it blank</p>
            </div>
        `);else{let n="";for(const t of s)n+=`<div class="col-4 mb-5">
                        <div class="small-box bg-light h-100">
                            <div class="inner">
                                <a href="${_baseURL}/clients/requests/create/purpose/${purposeId}/ticket?template=${t.id}" class="h5">${t.ticket_category.name}</a>
                                <p class="font-weight-normal text-sm">${t.name}</p>
                            </div>
                            <div class="icon">
                                <i class="fas fa-paste"></i>
                            </div>
                        </div>
                    </div>`;$("#itemListContainer").html(n)}}document.addEventListener("DOMContentLoaded",function(){c()});
