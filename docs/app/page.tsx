import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Github, MousePointerClick, MoveHorizontal, Maximize2, Type, Code, Zap } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <MousePointerClick className="h-6 w-6" />
              <span className="inline-block font-bold">Remarklet</span>
            </Link>
            <nav className="hidden gap-6 md:flex">
              <Link
                href="#features"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Features
              </Link>
              <Link
                href="#examples"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Examples
              </Link>
              <Link
                href="#docs"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Documentation
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Link
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Button>
                <Link href="#get-started">Get Started</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Visual Editing for the Web, <span className="text-primary">Made Simple</span>
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Remarklet adds drag-and-drop, resize, and text editing capabilities to any web page. Empower your users
              with intuitive visual editing without writing complex code.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg">
                <Link href="#get-started" className="flex items-center gap-1">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg">
                <Link href="#docs" className="flex items-center gap-1">
                  Documentation <Code className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        <section className="container space-y-6 py-8 md:py-12 lg:py-24" id="features">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
              Powerful Visual Editing Features
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Remarklet provides a suite of intuitive editing tools that work on any web page. No complex setup
              required.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <div className="relative overflow-hidden rounded-lg border bg-background p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MoveHorizontal className="h-6 w-6" />
              </div>
              <div className="space-y-2 pt-6">
                <h3 className="font-bold">Drag & Drop</h3>
                <p className="text-muted-foreground">
                  Easily move elements around the page with intuitive drag and drop functionality.
                </p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Maximize2 className="h-6 w-6" />
              </div>
              <div className="space-y-2 pt-6">
                <h3 className="font-bold">Resize Elements</h3>
                <p className="text-muted-foreground">
                  Adjust the size of any element with simple resize handles. Perfect for images, containers, and more.
                </p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Type className="h-6 w-6" />
              </div>
              <div className="space-y-2 pt-6">
                <h3 className="font-bold">Edit Text</h3>
                <p className="text-muted-foreground">
                  Click to edit text content directly on the page. What you see is what you get.
                </p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Zap className="h-6 w-6" />
              </div>
              <div className="space-y-2 pt-6">
                <h3 className="font-bold">Lightweight</h3>
                <p className="text-muted-foreground">
                  Remarklet is designed to be lightweight and performant, with minimal impact on page load times.
                </p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Code className="h-6 w-6" />
              </div>
              <div className="space-y-2 pt-6">
                <h3 className="font-bold">Simple Integration</h3>
                <p className="text-muted-foreground">
                  Add Remarklet to any project with just a few lines of code. No complex setup required.
                </p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Github className="h-6 w-6" />
              </div>
              <div className="space-y-2 pt-6">
                <h3 className="font-bold">Open Source</h3>
                <p className="text-muted-foreground">
                  Remarklet is open source and free to use. Contribute to the project on GitHub.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="container py-8 md:py-12 lg:py-24" id="examples">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">See Remarklet in Action</h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Watch how easy it is to edit web pages with Remarklet.
            </p>
          </div>
          <div className="mx-auto mt-16 flex max-w-[58rem] flex-col items-center justify-center gap-8">
            <div className="relative w-full overflow-hidden rounded-xl border bg-background shadow-xl">
              <div className="flex items-center justify-between border-b px-4">
                <div className="flex h-12 items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
                <div className="flex h-12 items-center">
                  <span className="text-sm text-muted-foreground">remarklet-demo.com</span>
                </div>
                <div className="w-12" />
              </div>
              <div className="aspect-video w-full bg-muted">
                <Image
                  src="/placeholder.svg?height=720&width=1280"
                  alt="Remarklet demo showing drag and drop functionality"
                  width={1280}
                  height={720}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="grid w-full gap-8 sm:grid-cols-2">
              <div className="flex flex-col items-center gap-2 rounded-lg border bg-background p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Code className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Simple Implementation</h3>
                <div className="w-full rounded-md bg-muted p-4">
                  <pre className="text-sm text-left">
                    <code>{`// Add Remarklet to your page
import Remarklet from 'remarklet';

// Initialize with options
const editor = new Remarklet({
  selector: '.editable',
  saveCallback: saveChanges
});

// Start editing
editor.enable();`}</code>
                  </pre>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-lg border bg-background p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <MousePointerClick className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">User-Friendly Interface</h3>
                <p className="text-muted-foreground">
                  Remarklet provides an intuitive interface that users can understand immediately. No training required.
                </p>
                <Image
                  src="/placeholder.svg?height=200&width=400"
                  alt="Remarklet user interface"
                  width={400}
                  height={200}
                  className="mt-4 rounded-lg border"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="bg-muted py-8 md:py-12 lg:py-24" id="get-started">
          <div className="container mx-auto px-4">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">Ready to Get Started?</h2>
              <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                Add Remarklet to your project in minutes.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <Button size="lg">
                  <Link href="#" className="flex items-center gap-1">
                    Install via NPM <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg">
                  <Link href="#" className="flex items-center gap-1">
                    View on GitHub <Github className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="mt-8 w-full max-w-3xl rounded-md bg-background p-4">
                <pre className="text-sm">
                  <code>{`# Install with npm
npm install remarklet

# Or with yarn
yarn add remarklet`}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} Remarklet. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Privacy
            </Link>
            <Link
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

