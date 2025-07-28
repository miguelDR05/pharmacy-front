<!-- <template>
  <div class="login-container">
    <q-card class="login-card">
      <q-card-section class="text-center">
        <h2 class="login-title">Bienvenido</h2>
        <p class="text-subtitle2">Inicia sesión para continuar</p>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="handleLogin">
          <div class="input-group">
            <q-input
              v-model="email"
              label="Correo electrónico"
              filled
              lazy-rules
              :rules="[(val) => !!val || 'El correo es requerido']"
              class="animated-input"
              type="email"
            />
          </div>

          <div class="input-group q-mt-md">
            <q-input
              v-model="password"
              label="Contraseña"
              filled
              lazy-rules
              :type="isPwd ? 'password' : 'text'"
              :rules="[(val) => !!val || 'La contraseña es requerida']"
              class="animated-input"
            >
              <template #append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
          </div>

          <q-btn
            label="Iniciar sesión"
            color="primary"
            class="full-width q-mt-lg login-button"
            type="submit"
            unelevated
            no-caps
          />
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@stores/Auth/auth';
import { useRouter } from 'vue-router';
import { Notify } from 'quasar';

const auth = useAuthStore();
const router = useRouter();
const email = ref<string>('');
const password = ref<string>('');
const isPwd = ref(true);

const handleLogin = async () => {
  try {
    await auth.login(email.value, password.value);
    return router.push('/');
  } catch (e: any) {
    Notify.create({
      type: 'negative',
      message: 'Credenciales inválidas',
    });
  }
};

onMounted(() => {
  console.log('Login.vue montado correctamente');
});
</script>
<style lang="scss" scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #3f51b5, #2196f3);
  animation: fadeIn 1s ease;
}

.login-card {
  width: 360px;
  padding: 20px;
  border-radius: 18px;
  background-color: white;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  animation: floatUp 0.8s ease;
}

.login-title {
  margin: 0;
  font-weight: 700;
  font-size: 28px;
  color: #3f51b5;
}

.input-group {
  position: relative;
}

.animated-input {
  transition: all 0.3s ease;
}

.login-button {
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease;
  &:hover {
    transform: scale(1.02);
  }
}

/* Animaciones */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes floatUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style> -->
<template>
  <div class="login-container">
    <!-- Background decorativo -->
    <div class="background-pattern">
      <div class="floating-pill pill-1"></div>
      <div class="floating-pill pill-2"></div>
      <div class="floating-pill pill-3"></div>
      <div class="floating-cross cross-1">+</div>
      <div class="floating-cross cross-2">+</div>
    </div>

    <q-card class="login-card">
      <!-- Logo y Header -->
      <q-card-section class="text-center header-section">
        <div class="logo-container">
          <div class="logo-icon">
            <q-icon name="local_pharmacy" size="48px" color="white" />
          </div>
          <h1 class="brand-name">PharmaCare</h1>
          <p class="brand-subtitle">Sistema de Gestión Farmacéutica</p>
        </div>
      </q-card-section>

      <!-- Formulario -->
      <q-card-section class="form-section">
        <div class="welcome-text">
          <h2 class="login-title">Bienvenido de vuelta</h2>
          <p class="login-subtitle">Inicia sesión para acceder al sistema</p>
        </div>

        <q-form @submit.prevent="handleLogin" class="login-form">
          <div class="input-container">
            <div class="input-icon">
              <q-icon name="mail_outline" color="primary" />
            </div>
            <q-input
              v-model="email"
              label="Correo electrónico"
              filled
              lazy-rules
              :rules="[(val) => !!val || 'El correo es requerido']"
              class="modern-input"
              type="email"
              bg-color="grey-1"
              borderless
              dense
              hide-bottom-space
            />
          </div>

          <div class="input-container">
            <div class="input-icon">
              <q-icon name="lock_outline" color="primary" />
            </div>
            <q-input
              v-model="password"
              label="Contraseña"
              filled
              lazy-rules
              :type="isPwd ? 'password' : 'text'"
              :rules="[(val) => !!val || 'La contraseña es requerida']"
              class="modern-input"
              bg-color="grey-1"
              borderless
              dense
              hide-bottom-space
            >
              <template #append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer password-toggle"
                  @click="isPwd = !isPwd"
                  color="grey-6"
                />
              </template>
            </q-input>
          </div>

          <div class="forgot-password">
            <q-btn
              flat
              no-caps
              dense
              color="primary"
              label="¿Olvidaste tu contraseña?"
              class="text-caption"
            />
          </div>

          <q-btn
            label="Iniciar Sesión"
            color="primary"
            class="full-width login-button"
            type="submit"
            unelevated
            no-caps
            size="lg"
          >
            <template #loading>
              <q-spinner color="white" size="20px" />
            </template>
          </q-btn>
        </q-form>
      </q-card-section>

      <!-- Footer -->
      <q-card-section class="footer-section">
        <div class="features-grid">
          <div class="feature-item">
            <q-icon name="inventory_2" color="primary" size="20px" />
            <span>Inventario</span>
          </div>
          <div class="feature-item">
            <q-icon name="shopping_cart" color="primary" size="20px" />
            <span>Compras</span>
          </div>
          <div class="feature-item">
            <q-icon name="people" color="primary" size="20px" />
            <span>Clientes</span>
          </div>
          <div class="feature-item">
            <q-icon name="receipt_long" color="primary" size="20px" />
            <span>Pedidos</span>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Info adicional -->
    <div class="bottom-info">
      <p>© 2025 PharmaCare. Sistema seguro y confiable</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/login/auth';
import { useRouter } from 'vue-router';
import { Notify } from 'quasar';

const auth = useAuthStore();
const router = useRouter();
const email = ref<string>('');
const password = ref<string>('');
const isPwd = ref(true);

const handleLogin = async () => {
  try {
    await auth.login(email.value, password.value);
    return router.push('/');
  } catch (e: any) {
    Notify.create({
      type: 'negative',
      message: 'Credenciales inválidas',
      position: 'top',
      timeout: 3000,
    });
  }
};

onMounted(() => {
  console.log('PharmaCare Login montado correctamente');
});
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, $secondary-color 0%, $white 50%, #e3f2fd 100%);
  // padding: 20px;
  position: relative;
  overflow: hidden;
}

.background-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
}

.floating-pill {
  position: absolute;
  width: 40px;
  height: 20px;
  background: rgba($primary-color, 0.1);
  border-radius: 20px;
  animation: float 6s ease-in-out infinite;

  &.pill-1 {
    top: 15%;
    left: 10%;
    animation-delay: 0s;
  }

  &.pill-2 {
    top: 70%;
    right: 15%;
    animation-delay: 2s;
  }

  &.pill-3 {
    bottom: 20%;
    left: 20%;
    animation-delay: 4s;
  }
}

.floating-cross {
  position: absolute;
  font-size: 30px;
  color: rgba($primary-color, 0.15);
  animation: rotate 8s linear infinite;

  &.cross-1 {
    top: 25%;
    right: 25%;
    animation-delay: 1s;
  }

  &.cross-2 {
    bottom: 30%;
    right: 30%;
    animation-delay: 3s;
  }
}

.login-card {
  width: 100%;
  max-width: 420px;
  border-radius: 24px;
  background-color: $white;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.08),
    0 8px 16px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba($primary-color, 0.1);
  overflow: hidden;
  position: relative;
  z-index: 1;
  animation: slideUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.header-section {
  background: linear-gradient(135deg, $primary-color, darken($primary-color, 10%));
  color: $white;
  padding: 24px 24px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  }
}

.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}

.logo-icon {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.brand-name {
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.brand-subtitle {
  font-size: 14px;
  opacity: 0.9;
  margin: 0;
  font-weight: 400;
}

.form-section {
  padding: 24px 24px;
}

.welcome-text {
  text-align: center;
  margin-bottom: 32px;
}

.login-title {
  font-size: 28px;
  font-weight: 600;
  color: $text-primary;
  margin: 0 0 8px;
  letter-spacing: -0.01em;
}

.login-subtitle {
  color: $text-secondary;
  font-size: 15px;
  margin: 0;
  font-weight: 400;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 10px;
}

.input-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  // margin-bottom: 12px;
}

.modern-input {
  flex: 1;

  :deep(.q-field__control) {
    border-radius: 12px !important;
    background-color: #f8f9fa !important;
    border: 2px solid transparent !important;
    transition: all 0.3s ease !important;

    &:hover {
      border-color: rgba($primary-color, 0.3) !important;
    }
  }

  :deep(.q-field__control):focus-within {
    border-color: $primary-color !important;
    box-shadow: 0 0 0 3px rgba($primary-color, 0.1) !important;
  }

  :deep(.q-field__label) {
    color: $text-secondary !important;
    font-weight: 500 !important;
  }

  :deep(.q-field__native) {
    color: $text-primary !important;
    font-weight: 500 !important;
  }
}

.password-toggle {
  transition: color 0.3s ease;

  &:hover {
    color: $primary-color !important;
  }
}

.forgot-password {
  text-align: right;
  margin-top: -8px;
}

.login-button {
  height: 56px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, $primary-color, darken($primary-color, 8%));
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba($primary-color, 0.3);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
  }
}

.footer-section {
  padding: 20px 24px 24px;
  background-color: #fafbfc;
  border-top: 1px solid #e9ecef;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: $white;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;

  span {
    font-size: 13px;
    font-weight: 500;
    color: $text-secondary;
  }

  &:hover {
    border-color: rgba($primary-color, 0.3);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
}

.bottom-info {
  margin-top: 24px;
  text-align: center;

  p {
    color: $text-secondary;
    font-size: 13px;
    margin: 0;
    opacity: 0.8;
  }
}

// Animaciones
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(10deg);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// Responsive
@media (max-width: 480px) {
  .login-card {
    margin: 0 16px;
    border-radius: 20px;
  }

  .header-section {
    padding: 24px 20px 20px;
  }

  .form-section {
    padding: 24px 20px 20px;
  }

  .brand-name {
    font-size: 28px;
  }

  .login-title {
    font-size: 24px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
