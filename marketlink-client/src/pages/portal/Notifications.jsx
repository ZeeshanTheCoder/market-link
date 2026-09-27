import { useEffect, useState } from "react";
import { getNotifications, markAllNotificationsRead, markNotificationRead, deleteNotification } from "../../api/notificationApi";
import Icon from "../../components/common/Icons";

export default function Notifications({ admin=false }) {
  const [items,setItems]=useState([]);
  const [loading,setLoading]=useState(true);
  const load=async()=>{try{setLoading(true);const {data}=await getNotifications();setItems(data.notifications||[])}finally{setLoading(false)}};
  useEffect(()=>{load()},[]);
  const unread=items.filter(x=>!x.read).length;
  const tone=(type)=>type==="order"?"bg-blue-50 text-blue-700":type==="market"?"bg-amber-50 text-amber-700":"bg-leaf-50 text-leaf-700";
  return <div className="space-y-7 animate-enter">
    <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="eyebrow">{admin?"Admin Console":"Updates"}</p><h1 className="mt-2 text-3xl font-extrabold">Notifications</h1><p className="mt-2 max-w-2xl text-sm leading-7 text-stone-500">Order progress, announcements, account updates and marketplace activity appear here in real time after the API is connected.</p></div>
        {unread>0&&<button className="btn-outline" onClick={async()=>{await markAllNotificationsRead();load()}}>Mark all read · {unread}</button>}
      </div>
    </div>
    {loading?<div className="rounded-2xl bg-white p-10 text-center text-sm text-stone-500">Loading notifications…</div>:items.length?<div className="space-y-3">{items.map(n=><article key={n._id} className={`rounded-2xl border bg-white p-5 shadow-sm ${n.read?"border-stone-200":"border-leaf-200 bg-leaf-50/20"}`}>
      <div className="flex items-start gap-4"><div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tone(n.type)}`}><Icon name="bell" className="h-5 w-5"/></div>
      <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-extrabold">{n.title}</h2>{!n.read&&<span className="badge bg-leaf-100 text-leaf-800">New</span>}</div><p className="mt-1 text-sm leading-7 text-stone-600">{n.message}</p><p className="mt-2 text-xs text-stone-400">{new Date(n.createdAt).toLocaleString()}</p><div className="mt-3 flex flex-wrap gap-3">{n.link&&<a href={n.link} className="text-xs font-bold text-leaf-700">Open related page →</a>}{!n.read&&<button onClick={async()=>{await markNotificationRead(n._id);load()}} className="text-xs font-bold text-navy-700">Mark read</button>}<button onClick={async()=>{await deleteNotification(n._id);load()}} className="text-xs font-bold text-stone-400 hover:text-red-600">Dismiss</button></div></div></div>
    </article>)}</div>:<div className="rounded-3xl border border-dashed border-stone-300 bg-white p-12 text-center"><div className="text-4xl">🔔</div><h2 className="mt-4 text-2xl font-extrabold">You're all caught up</h2><p className="mt-2 text-sm text-stone-500">New order and announcement updates will appear here.</p></div>}
  </div>;
}
