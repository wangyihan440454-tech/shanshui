import { MountainMark } from './Icons';
export type Section='hub'|'models'|'scrolls'|'library';
export function SectionHeader({onBack,label,backLabel='专题首页'}:{onBack:()=>void;label:string;backLabel?:string}){
 return <header className="site-header section-header"><button className="brand" onClick={onBack} aria-label={`山水，返回${backLabel}`}><MountainMark/></button><span className="header-note">{label}</span><button className="text-button" onClick={onBack}>{backLabel}</button></header>;
}
