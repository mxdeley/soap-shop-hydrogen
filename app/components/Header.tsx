import {Await, Link, NavLink} from '@remix-run/react';
import {Suspense} from 'react';
import type {CartApiQueryFragment, HeaderQuery} from 'storefrontapi.generated';
import type {LayoutProps} from './Layout';
import {useRootLoaderData} from '~/root';
import {CartForm, Image, Money} from '@shopify/hydrogen';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~/components/ui/sheet';
import {Button} from '~/components/ui/button';
import {
  CircleMinusIcon,
  CirclePlusIcon,
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
  TrashIcon,
} from 'lucide-react';
import {useVariantUrl} from '~/lib/variants';
import {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';

type CartLine = CartApiQueryFragment['lines']['nodes'][0];

type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: 'page' | 'aside';
};

type HeaderProps = Pick<LayoutProps, 'header' | 'cart' | 'isLoggedIn'>;

type Viewport = 'desktop' | 'mobile';

export function Header({header, isLoggedIn, cart}: HeaderProps) {
  const {shop, menu} = header;
  return (
    <>
      <header className="h-fit px-4 md:px-36 items-center justify-between fixed top-0 w-full bg-[#2B3117] text-white hidden md:flex border-b border-white z-50">
        <NavLink
          prefetch="intent"
          to="/"
          style={activeLinkStyle}
          end
          className="flex items-center gap-2 "
        >
          <img
            src={'/soap.svg'}
            alt={shop.name}
            className="w-8 h-8 text-white "
          />
          <h1 className="text-white">{shop.name}</h1>
        </NavLink>

        <HeaderCtas cart={cart} />
      </header>
      <header className="h-fit px-4 md:px-36 flex items-center justify-between fixed top-0 w-full bg-[#627050] text-white md:hidden border-b border-white z-50">
        <NavLink
          prefetch="intent"
          to="/"
          style={activeLinkStyle}
          end
          className="flex items-center gap-2"
        >
          <img src={'/soap.svg'} alt={shop.name} className="w-8 h-8 " />
          <h1 className="text-white">{shop.name}</h1>
        </NavLink>

        <HeaderCtas cart={cart} />
      </header>
    </>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url'];
  viewport: Viewport;
}) {
  const {publicStoreDomain} = useRootLoaderData();
  const className = `header-menu-${viewport}`;

  function closeAside(event: React.MouseEvent<HTMLAnchorElement>) {
    if (viewport === 'mobile') {
      event.preventDefault();
      window.location.href = event.currentTarget.href;
    }
  }

  return (
    <nav className={className} role="navigation">
      {viewport === 'mobile' && (
        <NavLink
          end
          onClick={closeAside}
          prefetch="intent"
          style={activeLinkStyle}
          to="/"
        >
          Home
        </NavLink>
      )}
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <NavLink
            className="header-menu-item"
            end
            key={item.id}
            onClick={closeAside}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

function HeaderCtas({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <nav>
      <Sheet>
        <SheetTrigger asChild>
          <div className="flex items-center">
            <ShoppingCartIcon className="w-6 h-6" />
            <CartToggle cart={cart} />
          </div>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Shopping Cart</SheetTitle>
          </SheetHeader>
          <CartAside cart={cart} />
        </SheetContent>
      </Sheet>
    </nav>
  );
}

function CartBadge({count}: {count: number}) {
  return (
    <a href="#cart-aside" className="mb-4">
      {count}
    </a>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        {(cart) => {
          if (!cart) return <CartBadge count={0} />;
          return <CartBadge count={cart.totalQuantity || 0} />;
        }}
      </Await>
    </Suspense>
  );
}

export function Aside({
  children,
  heading,
  id = 'aside',
}: {
  children?: React.ReactNode;
  heading: React.ReactNode;
  id?: string;
}) {
  return (
    <div aria-modal className="overlay" id={id} role="dialog">
      <button
        className="close-outside"
        onClick={() => {
          history.go(-1);
          window.location.hash = '';
        }}
      />
      <aside>
        <header>
          <h3>{heading}</h3>
          {/* <CloseAside /> */}
        </header>
        <main>{children}</main>
      </aside>
    </div>
  );
}

export function CartMain({layout, cart}: CartMainProps) {
  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const className = `cart-main ${withDiscount ? 'with-discount' : ''}`;

  return (
    <div className={className}>
      <CartEmpty hidden={linesCount} layout={layout} />
      <CartDetails cart={cart} layout={layout} />
    </div>
  );
}

function CartLines({
  lines,
  layout,
}: {
  layout: CartMainProps['layout'];
  lines: CartApiQueryFragment['lines'] | undefined;
}) {
  if (!lines) return null;

  return (
    <div aria-labelledby="cart-lines">
      <ul className="flex flex-col gap-2">
        {lines.nodes.map((line) => (
          <CartLineItem key={line.id} line={line} layout={layout} />
        ))}
      </ul>
    </div>
  );
}

function CartLineItem({
  layout,
  line,
}: {
  layout: CartMainProps['layout'];
  line: CartLine;
}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);

  return (
    <li key={id} className="flex gap-x-2">
      {image && (
        <Link
          prefetch="intent"
          to={lineItemUrl}
          onClick={() => {
            if (layout === 'aside') {
              // close the drawer
              window.location.href = lineItemUrl;
            }
          }}
        >
          <Image
            alt={title}
            aspectRatio="1/1"
            data={image}
            height={200}
            loading="lazy"
            width={200}
          />
        </Link>
      )}
      <div className="h-full w-full">
        <h1>{product.title}</h1>

        <CartLinePrice line={line} as="span" />
        <CartLineQuantity line={line} />
      </div>
    </li>
  );
}

function CartLineQuantity({line}: {line: CartLine}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="flex flex-col">
      <div className="flex-col items-center w-full">
        <h3 className="text-sm">Quantity: {quantity}</h3>
        <div className="flex gap-x-6">
          <div className="flex gap-x-2">
            <CartLineUpdateButton
              lines={[{id: lineId, quantity: prevQuantity}]}
            >
              <button
                aria-label="Decrease quantity"
                disabled={quantity <= 1}
                name="decrease-quantity"
                value={prevQuantity}
                className="items-center"
              >
                <CircleMinusIcon className="w-4 h-4" />
              </button>
            </CartLineUpdateButton>
            &nbsp;
            <CartLineUpdateButton
              lines={[{id: lineId, quantity: nextQuantity}]}
            >
              <button
                aria-label="Increase quantity"
                name="increase-quantity"
                value={nextQuantity}
              >
                <CirclePlusIcon className="w-4 h-4" />
              </button>
            </CartLineUpdateButton>
          </div>

          <CartLineRemoveButton lineIds={[lineId]} />
        </div>
      </div>
    </div>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

function CartLineRemoveButton({lineIds}: {lineIds: string[]}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button type="submit">
        <TrashIcon className="w-4 h-4" />
      </button>
    </CartForm>
  );
}

function CartLinePrice({
  line,
  priceType = 'regular',
  ...passthroughProps
}: {
  line: CartLine;
  priceType?: 'regular' | 'compareAt';
  [key: string]: any;
}) {
  if (!line?.cost?.amountPerQuantity || !line?.cost?.totalAmount) return null;

  const moneyV2 =
    priceType === 'regular'
      ? line.cost.totalAmount
      : line.cost.compareAtAmountPerQuantity;

  if (moneyV2 == null) {
    return null;
  }

  return (
    <div className="text-sm">
      <Money withoutTrailingZeros {...passthroughProps} data={moneyV2} />
    </div>
  );
}

function CartDetails({layout, cart}: CartMainProps) {
  const cartHasItems = !!cart && cart.totalQuantity > 0;

  return (
    <div className="flex flex-col gap-y-4">
      <CartLines lines={cart?.lines} layout={layout} />
      {cartHasItems && (
        <CartSummary cost={cart.cost} layout={layout}>
          {/* <CartDiscounts discountCodes={cart.discountCodes} /> */}
          <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />
        </CartSummary>
      )}
    </div>
  );
}

function CartCheckoutActions({checkoutUrl}: {checkoutUrl: string}) {
  if (!checkoutUrl) return null;

  return (
    <div className="mt-2 text-sm ">
      <a href={checkoutUrl} target="_self">
        <p className="bg-green-300 text-center p-2 rounded-md border-b-2 border-green-500">
          Continue to Checkout &rarr;
        </p>
      </a>
      <br />
    </div>
  );
}

export function CartSummary({
  cost,
  layout,
  children = null,
}: {
  children?: React.ReactNode;
  cost: CartApiQueryFragment['cost'];
  layout: CartMainProps['layout'];
}) {
  const className =
    layout === 'page' ? 'cart-summary-page' : 'cart-summary-aside';

  return (
    <div aria-labelledby="cart-summary" className={className}>
      <h4 className="font-bold">Totals</h4>
      <dl className="cart-subtotal">
        <dt className="text-sm font-semibold">Subtotal</dt>
        <dd className="text-sm">
          {cost?.subtotalAmount?.amount ? (
            <Money data={cost?.subtotalAmount} />
          ) : (
            '-'
          )}
        </dd>
      </dl>
      {children}
    </div>
  );
}

function CartDiscounts({
  discountCodes,
}: {
  discountCodes: CartApiQueryFragment['discountCodes'];
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div>
      {/* Have existing discount, display it with a remove option */}
      <dl hidden={!codes.length}>
        <div>
          <dt>Discount(s)</dt>
          <UpdateDiscountForm>
            <div className="cart-discount">
              <code>{codes?.join(', ')}</code>
              &nbsp;
              <button>Remove</button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div>
          <input type="text" name="discountCode" placeholder="Discount code" />
          &nbsp;
          <button type="submit">Apply</button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

export function CartEmpty({
  hidden = false,
  layout = 'aside',
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  return (
    <div hidden={hidden}>
      <br />
      <p className="text-bold">
        Looks like you haven&rsquo;t added anything yet, let&rsquo;s get you
        started!
      </p>
      <br />
      <Link
        to="/"
        onClick={() => {
          if (layout === 'aside') {
            window.location.href = '/';
          }
        }}
        className="bg-green-300 text-center p-2 rounded-md border-b-2 border-green-500"
      >
        Continue shopping →
      </Link>
    </div>
  );
}

function CartAside({cart}: {cart: LayoutProps['cart']}) {
  return (
    <Aside id="cart-aside" heading="">
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain cart={cart} layout="aside" />;
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'black',
  };
}
