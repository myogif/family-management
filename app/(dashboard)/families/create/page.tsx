import { CreateFamilyForm } from '@/components/forms/create-family-form'

export default function CreateFamilyPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Create Family</h1>
        <p className="text-muted-foreground mt-2">Create a new family to start managing finances together</p>
      </div>

      <div className="max-w-md">
        <CreateFamilyForm />
      </div>
    </div>
  )
}
