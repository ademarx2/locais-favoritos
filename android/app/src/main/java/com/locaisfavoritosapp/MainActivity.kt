package com.locaisfavoritosapp

import android.os.Bundle;
import androidx.core.view.WindowCompat // Importação necessária
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "LocaisFavoritosApp"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  /**
   * Correções para a interface do usuário no Android.
   */
  override fun onCreate(savedInstanceState: Bundle?) {
    // A linha super.onCreate(null) é uma correção para outro problema, mantenha-a.
    super.onCreate(null)
    // A linha abaixo desativa a renderização "edge-to-edge" e corrige a sobreposição da barra de navegação.
    WindowCompat.setDecorFitsSystemWindows(window, true)
  }
}
