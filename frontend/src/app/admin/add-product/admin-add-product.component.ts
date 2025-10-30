import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-admin-add-product',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule
    ],
    templateUrl: './admin-add-product.component.html',
    styleUrls: ['./admin-add-product.component.css']
})
export class AdminAddProductComponent implements OnInit {
    productForm!: FormGroup;
    loading = false;
    error = '';
    success = '';
    isEditMode = false;
    productId: string | null = null;

    private apiUrl = 'http://localhost:3000';

    constructor(
        private http: HttpClient,
        private router: Router,
        private fb: FormBuilder,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.initializeForm();
        
        // Vérifier si on est en mode édition
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.isEditMode = true;
                this.productId = params['id'];
                this.loadProduct(params['id']);
            } else {
                // Mode création : préremplissage aléatoire après 1 seconde
                setTimeout(() => {
                    this.fillFormWithRandomData();
                }, 1000);
            }
        });
    }

    initializeForm(): void {
        this.productForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            description: [''],
            price: [0, [Validators.required, Validators.min(0.01)]],
            stockQuantity: [0, [Validators.required, Validators.min(0)]],
            category: [''],
            imageUrl: ['']
        });
    }

    loadProduct(productId: string): void {
        this.http.get(`${this.apiUrl}/products/${productId}`).subscribe({
            next: (product: any) => {
                this.productForm.patchValue(product);
            },
            error: (err) => {
                this.error = 'Erreur lors du chargement du produit';
                console.error(err);
            }
        });
    }

    addProduct(): void {
        if (this.productForm.invalid) {
            this.error = 'Veuillez remplir les champs obligatoires correctement';
            return;
        }

        this.loading = true;
        this.error = '';
        this.success = '';

        if (this.isEditMode && this.productId) {
            // Mode édition : PUT
            this.http.put(`${this.apiUrl}/products/${this.productId}`, this.productForm.value).subscribe({
                next: () => {
                    this.success = 'Produit mis à jour avec succès! Redirection...';
                    setTimeout(() => {
                        this.router.navigate(['/admin/dashboard/products']);
                    }, 2000);
                },
                error: (err) => {
                    this.error = err.error?.message || 'Erreur lors de la mise à jour du produit';
                    this.loading = false;
                }
            });
        } else {
            // Mode création : POST
            this.http.post(`${this.apiUrl}/products`, this.productForm.value).subscribe({
                next: () => {
                    this.success = 'Produit créé avec succès! Redirection...';
                    setTimeout(() => {
                        this.router.navigate(['/admin/dashboard/products']);
                    }, 2000);
                },
                error: (err) => {
                    this.error = err.error?.message || 'Erreur lors de la création du produit';
                    this.loading = false;
                }
            });
        }
    }

    goBack(): void {
        this.router.navigate(['/admin/dashboard']);
    }

    fillFormWithRandomData(): void {
        const categories = ['Électronique', 'Vêtements', 'Livres', 'Maison', 'Sports', 'Jouets'];
        const adjectives = ['Premium', 'Deluxe', 'Pro', 'Ultra', 'Elite', 'Classic'];
        const nouns = ['Produit', 'Article', 'Item', 'Objet', 'Équipement', 'Accessoire'];

        this.productForm.patchValue({
            name: `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]} ${Math.floor(Math.random() * 1000)}`,
            description: `Description du produit généré aléatoirement. Ceci est un excellent produit avec de nombreuses fonctionnalités intéressantes.`,
            price: Math.floor(Math.random() * 500) + 10,
            stockQuantity: Math.floor(Math.random() * 100) + 1,
            category: categories[Math.floor(Math.random() * categories.length)],
            imageUrl: `https://picsum.photos/300/300?random=${Math.random()}`
        });
    }

    get imageUrl() {
        return this.productForm.get('imageUrl')?.value;
    }
}
