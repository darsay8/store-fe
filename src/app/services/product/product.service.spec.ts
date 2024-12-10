import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product, Category } from '../../models/models';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';

describe('ProductService', () => {
  let productService: ProductService;
  let httpMock: HttpTestingController;

  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'Product 1',
      description: 'Description of Product 1',
      price: 10,
      category: { id: 1, name: 'Category 1' },
      stock: 100,
      sku: 'SKU123',
      brand: 'Brand 1',
      createdAt: new Date(),
      imageUrl: 'https://example.com/product1.jpg',
    },
    {
      id: 2,
      name: 'Product 2',
      description: 'Description of Product 2',
      price: 20,
      category: { id: 2, name: 'Category 2' },
      stock: 50,
      sku: 'SKU456',
      brand: 'Brand 2',
      createdAt: new Date(),
      imageUrl: 'https://example.com/product2.jpg',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });

    productService = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(productService).toBeTruthy();
  });

  describe('getProducts', () => {
    it('should return a list of products on success', () => {
      productService.getProducts().subscribe((products) => {
        expect(products).toEqual(mockProducts);
      });

      const req = httpMock.expectOne('http://localhost:8082/api/products');
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);
    });
  });

  describe('handleError', () => {
    it('should log error and return an observable error', () => {
      const consoleSpy = spyOn(console, 'error');

      productService['handleError']('test error').subscribe(
        () => fail('expected an error, not products'),
        (error) => {
          expect(error).toBe('test error');
          expect(consoleSpy).toHaveBeenCalledWith(
            'An error occurred:',
            'test error'
          );
        }
      );
    });
  });
});
