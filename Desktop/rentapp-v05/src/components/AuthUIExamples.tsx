'use client'

import GoogleSignIn from './GoogleSignIn'
import AppleSignIn from './AppleSignIn'

// Showcase component for different authentication UI patterns
export default function AuthUIExamples() {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Google Authentication UI Examples</h1>
        <p className="text-gray-600">Different styles and variations for Google sign-in buttons</p>
      </div>

      {/* Size Variations */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Size Variations</h2>
        <div className="grid gap-4 max-w-md">
          <div>
            <p className="text-sm text-gray-600 mb-2">Small (sm)</p>
            <GoogleSignIn size="sm" />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Medium (md) - Default</p>
            <GoogleSignIn size="md" />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Large (lg)</p>
            <GoogleSignIn size="lg" />
          </div>
        </div>
      </section>

      {/* Style Variations */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Style Variations</h2>
        <div className="grid gap-4 max-w-md">
          <div>
            <p className="text-sm text-gray-600 mb-2">Default Style</p>
            <GoogleSignIn variant="default" />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Compact Style</p>
            <GoogleSignIn variant="compact" />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Outline Style</p>
            <GoogleSignIn variant="outline" />
          </div>
        </div>
      </section>

      {/* Login Form Examples */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Login Form Layouts</h2>

        {/* Example 1: Google First */}
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-md">
          <h3 className="text-lg font-semibold text-center mb-6">Google First Layout</h3>
          <div className="space-y-1">
            <GoogleSignIn />
            <AppleSignIn />
            <p className="text-center text-xs text-gray-500 mt-1">(Shows Google and Apple login options)</p>
            <div className="text-right pr-2 mt-2">
              <button className="text-blue-500 hover:text-blue-600 font-medium transition-colors">
                Login with Email
              </button>
            </div>
            {/* Email form would appear here when clicked */}
            <div className="text-center text-sm text-gray-500 mt-2">
              (Click "Login with Email" to see form)
            </div>
          </div>
        </div>

        {/* Example 2: Side by Side */}
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl">
          <h3 className="text-lg font-semibold text-center mb-6">Side by Side Layout</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700">Continue with Google</h4>
              <GoogleSignIn />
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700">Sign in with Email</h4>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors">
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Example 3: Toggle Pattern */}
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-md">
          <h3 className="text-lg font-semibold text-center mb-6">Toggle Pattern Layout</h3>
          <div className="space-y-1">
            <GoogleSignIn />
            <div className="text-right pr-2">
              <button className="text-blue-500 hover:text-blue-600 font-medium transition-colors">
                Login with Email
              </button>
            </div>
            {/* Email form would appear here, Google button would be hidden */}
            <div className="border-t border-gray-200 pt-3 space-y-2 opacity-50">
              <p className="text-center text-sm text-gray-500 mb-2">Email form (Google button hidden):</p>
              <input
                type="email"
                placeholder="Email address"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled
              />
              <button className="w-full bg-blue-500 text-white py-3 rounded-lg" disabled>
                Sign In
              </button>
              <div className="text-right pr-2">
                <button className="text-blue-500 hover:text-blue-600 font-medium underline transition-colors opacity-50">
                  Login with Google
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Example 4: Minimal */}
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-md">
          <h3 className="text-lg font-semibold text-center mb-6">Minimal Layout</h3>
          <div className="text-center space-y-4">
            <p className="text-gray-600">Welcome back! Sign in to continue.</p>
            <GoogleSignIn variant="outline" />
            <p className="text-sm text-gray-500">
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </section>

      {/* Additional Social Auth Examples */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Multi-Social Auth Layout</h2>
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-md">
          <h3 className="text-lg font-semibold text-center mb-6">Multiple Sign-in Options</h3>
          <div className="space-y-3">
            <GoogleSignIn />
            <AppleSignIn />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            <div className="space-y-3">
              <input
                type="email"
                placeholder="Email address"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
