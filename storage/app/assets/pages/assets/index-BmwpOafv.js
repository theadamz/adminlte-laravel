import{o as f}from"./general-DAK3ebw_.js";const t=".infinite-scroll-container",d=".infinite-scroll-last",a=".indicator-progress",h="#keyword",m=10;let n=null,l=1,c=null,r=null,s=null;const u={init:function(){n=new InfiniteScroll(document.querySelector(t),{path:()=>($(a).removeClass("d-none"),l===1&&$(t).addClass("d-none"),`${_baseURL}/s2/knowledges?perPage=${m}&page=${l}&keyword=${$(h).val()}`),responseBody:"json",history:!1,scrollThreshold:5}),n.on("load",function(e,v,i){if([200].includes(i.status)&&e.data.length<=0&&l==1&&(n.appendItems($(`
                    <div class="d-flex flex-column align-items-center">
                        <h1><i class="fas fa-question"></i></h1>
                        <h1>Not found</h1>
                        <p>Please use other keyword or you can leave it blank</p>
                    </div>
                `)),n.lastPageReached(),$(a).addClass("d-none"),$(t).removeClass("d-none")),[200].includes(i.status)&&e.data.length<=0&&l>1&&($(a).addClass("d-none"),n.lastPageReached(),$(d).removeClass("d-none")),[200].includes(i.status)&&e.data.length>0){let o="";o=e.data.map(g).join(""),n.appendItems($(o)),l++,$(a).addClass("d-none"),$(t).removeClass("d-none")}}),n.loadNextPage()},reset:function(){l=1,$(t).addClass("d-none"),$(t).html(null),$(d).addClass("d-none"),n.resetPage()}};function g(e){return`<div class="col-6 mb-5">
                        <div class="callout callout-info h-100">
                            <div class="d-flex flex-column h-100">
                                <a href="${_baseURL}/clients/knowledges/${e.slug}" style="text-decoration: none;">
                                    <h5>${e.subject}</h5>
                                </a>
                                <p class="flex-grow-1">${e.excerpt}</p>
                                <div class="d-flex justify-content-between">
                                    <span class="text-muted">${f(e.updated_at)}</span>
                                    <a href="${_baseURL}/clients/knowledges/${e.slug}" class="m-0 text-muted" style="text-decoration: none;">Read more <i class="fas fa-arrow-circle-right ml-2"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>`}function p(){$("#keyword").on("keyup change",function(e){s=$(this).val().trim(),clearTimeout(c),c=setTimeout(function(){s!=null&&r!=s&&(r=s,u.reset())},500)}),u.init()}document.addEventListener("DOMContentLoaded",function(){p()});
