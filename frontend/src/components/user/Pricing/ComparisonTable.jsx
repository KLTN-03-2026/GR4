import { CheckCircle2, XCircle, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export default function ComparisonTable() {
  const features = [
    { name: 'Kho phim miễn phí', free: true, vip: true },
    { name: 'Quảng cáo khi xem', free: 'Có quảng cáo', vip: 'Không quảng cáo', highlight: true },
    { name: 'Độ phân giải tối đa', free: '720p HD', vip: '4K Ultra HD + HDR', highlight: true },
    { name: 'Phim độc quyền Cinema+', free: false, vip: true }
  ];

  return (
    <div className="overflow-hidden rounded-[2.5rem] bg-neutral-900/30 backdrop-blur-3xl border border-white/5 shadow-2xl relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-[100px] -z-10"></div>
      
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-white/5">
            <th className="p-8 text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Tính năng</th>
            <th className="p-8 text-center">
               <div className="flex flex-col items-center gap-2">
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Cơ bản</span>
                  <span className="text-sm font-black text-white uppercase italic">Miễn phí</span>
               </div>
            </th>
            <th className="p-8 text-center bg-white/5 relative">
               <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>
               <div className="flex flex-col items-center gap-2">
                  <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em] flex items-center gap-2">
                    <Zap className="w-3 h-3 animate-pulse" /> Đề xuất
                  </span>
                  <span className="text-xl font-black text-white uppercase italic flex items-center gap-2">
                    VIP <ShieldCheck className="w-5 h-5 text-red-500" />
                  </span>
               </div>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {features.map((feature, index) => (
            <motion.tr 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              key={index} 
              className="group hover:bg-white/[0.02] transition-colors"
            >
              <td className="p-8 text-xs font-black text-white/60 uppercase tracking-widest group-hover:text-white transition-colors">{feature.name}</td>
              <td className="p-8 text-center">
                {typeof feature.free === 'boolean' ? (
                  feature.free ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto opacity-40" />
                  ) : (
                    <XCircle className="w-5 h-5 text-white/10 mx-auto" />
                  )
                ) : (
                  <span className="text-[11px] font-black text-white/40 uppercase tracking-widest italic">{feature.free}</span>
                )}
              </td>
              <td className="p-8 text-center bg-white/[0.03]">
                {typeof feature.vip === 'boolean' ? (
                  feature.vip ? (
                    <div className="relative inline-block">
                       <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto shadow-lg shadow-emerald-500/20" />
                       <motion.div 
                        animate={{ scale: [1, 1.5, 1], opacity: [0, 0.5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-emerald-500 rounded-full"
                       ></motion.div>
                    </div>
                  ) : (
                    <XCircle className="w-6 h-6 text-white/10 mx-auto" />
                  )
                ) : (
                  <span className={feature.highlight ? "text-sm font-black text-red-500 uppercase italic tracking-wider stroke-text" : "text-sm font-black text-white italic uppercase tracking-wider"}>
                    {feature.vip}
                  </span>
                )}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
