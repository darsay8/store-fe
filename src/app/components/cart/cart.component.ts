import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage/storage.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order/order.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  cart: { productId: number; name: string; price: number; quantity: number }[] =
    [];
  totalAmount: number = 0;
  isLoading: boolean = false;
  userId: number = 0;

  constructor(
    private storageService: StorageService,
    private router: Router,
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCart();
    this.userId = this.authService.getCurrentUser()?.id || 0;
  }

  loadCart(): void {
    this.cart = this.storageService.getItem('cart') || [];
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.totalAmount = this.cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  removeItem(productId: number): void {
    this.cart = this.cart.filter((item) => item.productId !== productId);
    this.storageService.setItem('cart', this.cart);
    this.calculateTotal();
  }

  placeOrder(): void {
    if (this.cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    this.isLoading = true;

    this.orderService.createOrder(this.userId, this.cart).subscribe(
      (response) => {
        alert('Order placed successfully!');
        this.storageService.removeItem('cart');
        this.router.navigate(['/']);
        this.isLoading = false;
      },
      (error) => {
        alert('Failed to place order. Please try again.');
        this.isLoading = false;
      }
    );
  }
}
