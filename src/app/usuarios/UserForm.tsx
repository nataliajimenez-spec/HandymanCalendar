"use client";

import { useRef, useState, useTransition } from "react";
import { createUser } from "./actions";

export function UserForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      const result = await createUser(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        formRef.current?.reset();
      }
    });
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="bg-white border rounded-lg p-4 space-y-3 max-w-md"
    >
      <h2 className="font-medium">Crear usuario</h2>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </div>
      )}
      {success && (
        <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">
          Usuario creado.
        </div>
      )}

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="name">
          Nombre
        </label>
        <input id="name" name="name" required className="w-full border rounded px-3 py-2 text-sm" />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full border rounded px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="password">
          Contraseña temporal
        </label>
        <input
          id="password"
          name="password"
          type="text"
          required
          minLength={8}
          placeholder="Mínimo 8 caracteres"
          className="w-full border rounded px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="role">
          Rol
        </label>
        <select id="role" name="role" className="w-full border rounded px-3 py-2 text-sm">
          <option value="HANDYMAN">Handyman</option>
          <option value="OFICINA">Oficina</option>
          <option value="ADMIN">Administrador</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 text-white rounded py-2 text-sm font-medium disabled:opacity-50"
      >
        {isPending ? "Creando..." : "Crear usuario"}
      </button>
    </form>
  );
}
