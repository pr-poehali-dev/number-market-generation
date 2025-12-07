import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';

type PlateType = 'vip' | 'standard' | 'taxi' | 'moto';

interface Plate {
  id: string;
  combo: string;
  combo_display: string;
  region: number;
  type: PlateType;
  price: number;
}

const DEMO_PLATES: Plate[] = [
  { id: '1', combo: 'A777AA', combo_display: 'A777AA 77', region: 77, type: 'vip', price: 150000 },
  { id: '2', combo: 'B123BC', combo_display: 'B123BC 77', region: 77, type: 'standard', price: 15000 },
  { id: '3', combo: 'C001CC', combo_display: 'C001CC 78', region: 78, type: 'vip', price: 120000 },
  { id: '4', combo: 'T555TT', combo_display: 'T555TT 50', region: 50, type: 'taxi', price: 80000 },
  { id: '5', combo: 'M777MM', combo_display: 'M777MM 97', region: 97, type: 'moto', price: 60000 },
  { id: '6', combo: 'E999EE', combo_display: 'E999EE 77', region: 77, type: 'vip', price: 180000 },
  { id: '7', combo: 'K555KK', combo_display: 'K555KK 78', region: 78, type: 'vip', price: 140000 },
  { id: '8', combo: 'O234OO', combo_display: 'O234OO 50', region: 50, type: 'standard', price: 25000 },
];

const REGIONS = [
  { value: 'all', label: 'Все' },
  { value: '77', label: '77 Москва' },
  { value: '78', label: '78 Санкт-Петербург' },
  { value: '50', label: '50 Московская область' },
  { value: '97', label: '97 Москва (доп.)' },
];

const TYPES = [
  { value: 'all', label: 'Все типы' },
  { value: 'standard', label: 'Стандарт' },
  { value: 'vip', label: 'Красивый номер' },
  { value: 'taxi', label: 'Такси' },
  { value: 'moto', label: 'Мото' },
];

const TYPE_LABELS: Record<PlateType, string> = {
  vip: 'Красивый номер',
  standard: 'Стандарт',
  taxi: 'Такси',
  moto: 'Мото',
};

export default function Index() {
  const [cart, setCart] = useState<Plate[]>([]);
  const [regionFilter, setRegionFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    comment: '',
  });

  const filteredPlates = DEMO_PLATES.filter((plate) => {
    const matchesRegion = regionFilter === 'all' || plate.region.toString() === regionFilter;
    const matchesType = typeFilter === 'all' || plate.type === typeFilter;
    const matchesSearch = searchQuery === '' || plate.combo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesType && matchesSearch;
  });

  const addToCart = (plate: Plate) => {
    if (cart.some((item) => item.id === plate.id)) {
      toast({ title: 'Номер уже в корзине', variant: 'destructive' });
      return;
    }
    setCart([...cart, plate]);
    toast({ title: 'Добавлено в корзину', description: plate.combo_display });
  };

  const removeFromCart = (plateId: string) => {
    setCart(cart.filter((item) => item.id !== plateId));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedOrderNumber = `NM${Date.now().toString().slice(-6)}`;
    setOrderNumber(generatedOrderNumber);
    setCart([]);
    setFormData({ name: '', phone: '', email: '', comment: '' });
    toast({
      title: '✅ Заявка отправлена!',
      description: `Номер заявки: ${generatedOrderNumber}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <Icon name="Hash" size={24} className="text-accent-foreground" />
            </div>
            <h1 className="text-2xl font-bold">НомерМаркет</h1>
          </div>
          <nav className="hidden md:flex gap-6 items-center">
            <a href="#catalog" className="hover:text-accent transition-colors">
              Каталог
            </a>
            <a href="#how-it-works" className="hover:text-accent transition-colors">
              Как это работает
            </a>
            <a href="#faq" className="hover:text-accent transition-colors">
              FAQ
            </a>
          </nav>
          <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="relative bg-white hover:bg-gray-50">
                <Icon name="ShoppingCart" size={20} />
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-accent text-accent-foreground">
                    {cart.length}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="text-2xl">Корзина</SheetTitle>
              </SheetHeader>
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                  <Icon name="ShoppingCart" size={64} className="mb-4 opacity-50" />
                  <p className="text-lg">Корзина пуста</p>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {cart.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-lg">{item.combo_display}</p>
                            <p className="text-sm text-muted-foreground">Регион: {item.region}</p>
                            <p className="text-sm text-muted-foreground">{TYPE_LABELS[item.type]}</p>
                            <p className="font-semibold text-accent mt-2">
                              {item.price.toLocaleString('ru-RU')} ₽
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromCart(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Icon name="Trash2" size={18} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-xl font-bold mb-4">
                      <span>Итого:</span>
                      <span className="text-accent">{totalPrice.toLocaleString('ru-RU')} ₽</span>
                    </div>
                    <Button
                      className="w-full bg-success hover:bg-success/90 text-success-foreground"
                      size="lg"
                      onClick={() => {
                        setIsCartOpen(false);
                        setIsCheckoutOpen(true);
                      }}
                    >
                      Оформить заказ
                    </Button>
                  </div>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <section className="bg-gradient-to-b from-primary to-primary/90 text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Красивые автомобильные номера онлайн
          </h2>
          <p className="text-lg md:text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Выбирайте номера по региону, типу и комбинации. Оформляйте заявку за пару минут.
          </p>
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6"
            onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Перейти к каталогу
            <Icon name="ArrowDown" size={20} className="ml-2" />
          </Button>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: 'Search', title: 'Простой поиск', desc: 'Удобные фильтры по всем параметрам' },
              { icon: 'Sparkles', title: 'Красивые комбинации', desc: 'Широкий выбор VIP-номеров' },
              { icon: 'Zap', title: 'Быстрая заявка', desc: 'Оформление за 2 минуты' },
              { icon: 'DollarSign', title: 'Прозрачные цены', desc: 'Честная стоимость без скрытых комиссий' },
            ].map((item, idx) => (
              <Card key={idx} className="text-center hover:shadow-lg transition-all animate-scale-in">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name={item.icon as any} size={32} className="text-accent" />
                  </div>
                  <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Как это работает</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { step: '1', title: 'Выбираете номер', desc: 'Фильтруйте каталог по своим критериям' },
              { step: '2', title: 'Добавляете в корзину', desc: 'Соберите все понравившиеся номера' },
              { step: '3', title: 'Заполняете заявку', desc: 'Укажите контактные данные' },
              { step: '4', title: 'Менеджер связывается с вами', desc: 'Получите звонок для уточнения деталей' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="catalog" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Каталог номеров</h2>

          <div className="bg-card p-6 rounded-lg shadow-md mb-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="region" className="mb-2 block">
                  Регион
                </Label>
                <Select value={regionFilter} onValueChange={setRegionFilter}>
                  <SelectTrigger id="region">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REGIONS.map((region) => (
                      <SelectItem key={region.value} value={region.value}>
                        {region.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="type" className="mb-2 block">
                  Тип номера
                </Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="search" className="mb-2 block">
                  Поиск по комбинации
                </Label>
                <Input
                  id="search"
                  placeholder="777, ААА..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {filteredPlates.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Icon name="Search" size={64} className="mx-auto mb-4 opacity-50" />
              <p className="text-xl">Номера не найдены. Измените параметры поиска.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPlates.map((plate) => (
                <Card key={plate.id} className="hover:shadow-xl transition-all hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg p-4 mb-4 border-2 border-gray-800">
                      <p className="text-center text-3xl font-black tracking-wider text-gray-900">
                        {plate.combo_display}
                      </p>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Регион:</span>
                        <span className="font-semibold">{plate.region}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Тип:</span>
                        <Badge variant={plate.type === 'vip' ? 'default' : 'secondary'}>
                          {TYPE_LABELS[plate.type]}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-accent mb-4">
                      {plate.price.toLocaleString('ru-RU')} ₽
                    </p>
                    <Button
                      className="w-full bg-success hover:bg-success/90 text-success-foreground"
                      onClick={() => addToCart(plate)}
                    >
                      <Icon name="ShoppingCart" size={18} className="mr-2" />
                      В корзину
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="faq" className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">FAQ</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Это реальная покупка номера?',
                a: 'Нет, это демонстрационный прототип. В реальном сервисе будет интеграция с ГИБДД.',
              },
              {
                q: 'Сколько времени занимает оформление?',
                a: 'Заявка оформляется за 2-3 минуты. После этого с вами свяжется менеджер.',
              },
              {
                q: 'Можно ли зарезервировать номер?',
                a: 'Да, после оформления заявки номер резервируется на 24 часа.',
              },
            ].map((item, idx) => (
              <Card key={idx}>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">{item.q}</h3>
                  <p className="text-muted-foreground">{item.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg mb-2">НомерМаркет. Демонстрационный прототип.</p>
          <div className="flex justify-center gap-6 text-sm">
            <a href="#" className="hover:text-accent transition-colors">
              О сервисе
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              Политика конфиденциальности
            </a>
          </div>
        </div>
      </footer>

      <Sheet open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-2xl">Оформление заказа</SheetTitle>
          </SheetHeader>

          {orderNumber ? (
            <div className="flex flex-col items-center justify-center h-96 text-center animate-scale-in">
              <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-6">
                <Icon name="CheckCircle" size={48} className="text-success" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Заявка отправлена!</h3>
              <p className="text-lg mb-2">Номер вашей заявки:</p>
              <p className="text-3xl font-bold text-accent mb-6">{orderNumber}</p>
              <p className="text-muted-foreground mb-8">
                Наш менеджер свяжется с вами в ближайшее время.
              </p>
              <Button
                onClick={() => {
                  setOrderNumber('');
                  setIsCheckoutOpen(false);
                }}
              >
                Закрыть
              </Button>
            </div>
          ) : (
            <form onSubmit={handleCheckout} className="mt-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-base">
                    Имя и фамилия <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Иван Иванов"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-base">
                    Телефон <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+7 (999) 123-45-67"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-base">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="comment" className="text-base">
                    Комментарий
                  </Label>
                  <Input
                    id="comment"
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    placeholder="Дополнительные пожелания"
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-bold text-lg mb-3">Ваш заказ:</h4>
                <div className="space-y-2 mb-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.combo_display}</span>
                      <span className="font-semibold">{item.price.toLocaleString('ru-RU')} ₽</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center text-xl font-bold mb-6">
                  <span>Итого:</span>
                  <span className="text-accent">{totalPrice.toLocaleString('ru-RU')} ₽</span>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-success hover:bg-success/90 text-success-foreground"
                  size="lg"
                >
                  Отправить заявку
                </Button>
              </div>
            </form>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
