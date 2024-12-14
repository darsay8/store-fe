import { Component, OnInit, inject } from '@angular/core';
import { Product, User } from '../../models/models';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product/product.service';
import { AuthService } from '../../services/auth/auth.service';
import { StorageService } from '../../services/storage/storage.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  route = inject(ActivatedRoute);
  router = inject(Router);

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((products: Product[]) => {
      this.products = products;
    });
  }

  getCurrentUser(): any {
    return this.authService.getCurrentUser();
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logoutUser();
  }

  addToCart(product: Product): void {
    let cart: {
      productId: number;
      name: string;
      price: number;
      quantity: number;
    }[] = this.storageService.getItem('cart') || [];

    const existingProductIndex = cart.findIndex(
      (item) => item.productId === product.id
    );

    if (existingProductIndex === -1) {
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      });
    } else {
      cart[existingProductIndex].quantity += 1;
    }

    this.storageService.setItem('cart', cart);

    const toastElement = document.getElementById('toast') as HTMLElement;
    if (toastElement) {
      const toast = new bootstrap.Toast(toastElement);
      toast.show();

      setTimeout(() => {
        toast.hide();
      }, 1000);
    }
  }
}
