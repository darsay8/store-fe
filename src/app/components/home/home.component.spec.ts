import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { ProductService } from '../../services/product/product.service';
import { AuthService } from '../../services/auth/auth.service';
import { StorageService } from '../../services/storage/storage.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

// Mock data for Product and Category
const mockCategories = [
  { id: 1, name: 'Smartphones' },
  { id: 2, name: 'Laptops' },
];

const mockProducts = [
  {
    id: 1,
    name: 'iPhone 15 Pro',
    description: 'Latest Apple smartphone with advanced features.',
    price: 999.99,
    category: mockCategories[0],
    stock: 100,
    sku: 'SKU123',
    brand: 'Apple',
    createdAt: new Date('2024-11-18T11:29:35.717291'),
    imageUrl:
      'https://cdn11.bigcommerce.com/s-xt5en0q8kf/images/stencil/1280x1280/products/12264/30177/iphone15p__00220.1700249228.jpg?c=2',
  },
  {
    id: 2,
    name: 'MacBook Pro M3 Pro',
    description: 'High-performance laptop with M1 chip.',
    price: 1999.99,
    category: mockCategories[1],
    stock: 50,
    sku: 'SKU456',
    brand: 'Apple',
    createdAt: new Date('2024-11-18T11:29:35.749981'),
    imageUrl:
      'https://www.bhphotovideo.com/images/images500x500/apple_mrx33ll_a_14_macbook_pro_with_1698709615_1793624.jpg',
  },
];

const mockUser = {
  id: 1,
  username: 'john',
  email: 'john@mail.com',
  password: 'Password123',
  role: 'USER',
};

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let productService: jasmine.SpyObj<ProductService>;
  let authService: jasmine.SpyObj<AuthService>;
  let storageService: jasmine.SpyObj<StorageService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductService', [
      'getProducts',
    ]);
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getCurrentUser',
      'isLoggedIn',
      'logoutUser',
    ]);
    const storageServiceSpy = jasmine.createSpyObj('StorageService', [
      'getItem',
      'setItem',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', [
      'navigate',
      'events',
      'createUrlTree',
      'serializeUrl',
    ]);

    // Mock the `createUrlTree` and `serializeUrl` methods
    routerSpy.createUrlTree.and.returnValue({});
    routerSpy.serializeUrl.and.returnValue('/mock-url');

    // Mock the events observable for the router
    routerSpy.events = of(); // Simply emit an empty observable to mock the events

    // Provide the mocked services
    await TestBed.configureTestingModule({
      imports: [HomeComponent, CommonModule, RouterTestingModule],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: {} }, // Mock ActivatedRoute if needed
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(
      ProductService
    ) as jasmine.SpyObj<ProductService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    storageService = TestBed.inject(
      StorageService
    ) as jasmine.SpyObj<StorageService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should return the current user', () => {
    // Mock user data
    authService.getCurrentUser.and.returnValue(mockUser);

    const user = component.getCurrentUser();
    expect(user).toEqual(mockUser);
  });

  it('should return true when user is logged in', () => {
    authService.isLoggedIn.and.returnValue(true);

    const isLoggedIn = component.isLoggedIn();
    expect(isLoggedIn).toBeTrue();
  });

  it('should return false when user is not logged in', () => {
    authService.isLoggedIn.and.returnValue(false);

    const isLoggedIn = component.isLoggedIn();
    expect(isLoggedIn).toBeFalse();
  });

  it('should fetch products from product service', () => {
    productService.getProducts.and.returnValue(of(mockProducts));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.products).toEqual(mockProducts);
    expect(productService.getProducts).toHaveBeenCalled();
  });

  it('should logout the user when logout is called', () => {
    authService.logoutUser.and.callThrough();

    component.logout();

    expect(authService.logoutUser).toHaveBeenCalled();
  });

  it('should handle empty product list gracefully', () => {
    productService.getProducts.and.returnValue(of([]));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.products.length).toBe(0);
  });

  it('should handle empty product list gracefully', () => {
    productService.getProducts.and.returnValue(of([]));

    component.ngOnInit();
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const productElements = compiled.querySelectorAll('.product');

    expect(productElements.length).toBe(
      0,
      'Should not display any products when the list is empty'
    );
  });
});
