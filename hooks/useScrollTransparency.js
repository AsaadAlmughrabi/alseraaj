'use client';
import {useEffect, useState} from 'react';


export default function useScrollTransparency(threshold = 16) {
const [scrolled, setScrolled] = useState(false);


useEffect(() => {
function onScroll() {
setScrolled(window.scrollY >= threshold);
}
onScroll();
window.addEventListener('scroll', onScroll, {passive: true});
return () => window.removeEventListener('scroll', onScroll);
}, [threshold]);


return scrolled;
}