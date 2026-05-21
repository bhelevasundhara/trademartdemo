import {
  Settings2, Building2, Zap, Car, ShoppingBag,
  Package, MoreHorizontal, Leaf, Shirt, Cpu, Heart, LucideIcon
} from 'lucide-react';

export function getProductImage(productName: string): string {
  const name = productName?.toLowerCase() || '';
  if (name.includes('excavator') || name.includes('hydraulic press'))
    return 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&q=80';
  if (name.includes('generator') || name.includes('diesel'))
    return 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80';
  if (name.includes('cnc') || name.includes('lathe') || name.includes('milling'))
    return 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=300&q=80';
  if (name.includes('pump'))
    return 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=300&q=80';
  if (name.includes('compressor'))
    return 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300&q=80';
  if (name.includes('solar') || name.includes('panel'))
    return 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=300&q=80';
  if (name.includes('tea') || name.includes('rice') || name.includes('agriculture'))
    return 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&q=80';
  if (name.includes('soap') || name.includes('cosmetic') || name.includes('beauty'))
    return 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&q=80';
  if (name.includes('phone') || name.includes('mobile') || name.includes('electronic'))
    return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80';
  if (name.includes('jeans') || name.includes('shirt') || name.includes('apparel'))
    return 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&q=80';
  return 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&q=80';
}

export function getCategoryIcon(categoryName: string): LucideIcon {
  const name = categoryName?.toLowerCase() || '';
  if (name.includes('agriculture') || name.includes('farm'))
    return Leaf;
  if (name.includes('apparel') || name.includes('fashion') ||
      name.includes('clothing') || name.includes('textile'))
    return Shirt;
  if (name.includes('electronics') || name.includes('electrical'))
    return Zap;
  if (name.includes('health') || name.includes('beauty') ||
      name.includes('cosmetic'))
    return Heart;
  if (name.includes('machinery') || name.includes('industrial'))
    return Settings2;
  if (name.includes('construction') || name.includes('building'))
    return Building2;
  if (name.includes('automobile') || name.includes('auto') ||
      name.includes('vehicle'))
    return Car;
  if (name.includes('consumer') || name.includes('goods'))
    return ShoppingBag;
  if (name.includes('packaging') || name.includes('printing'))
    return Package;
  return MoreHorizontal;
}
