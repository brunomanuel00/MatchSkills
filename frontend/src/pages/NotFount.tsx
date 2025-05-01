import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ArrowLeft, Home, Search, X } from "lucide-react";

export default function NotFound() {
    const [mounted, setMounted] = useState(false)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [nodes, setNodes] = useState<
        Array<{ x: number; y: number; vx: number; vy: number; radius: number; skill: string }>
    >([])

    // Lista de habilidades para los nodos
    const skills = [
        "JavaScript",
        "React",
        "Design",
        "UX",
        "Python",
        "Marketing",
        "Data",
        "AI",
        "Node.js",
        "Leadership",
        "Communication",
        "Product",
        "Sales",
        "Content",
        "SEO",
    ]

    useEffect(() => {
        setMounted(true)

        // Inicializar nodos
        const newNodes = []
        for (let i = 0; i < 15; i++) {
            newNodes.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                radius: Math.random() * 20 + 30,
                skill: skills[i % skills.length],
            })
        }
        setNodes(newNodes)

        // Configurar canvas y animación
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        const handleResize = () => {
            if (canvas) {
                canvas.width = window.innerWidth
                canvas.height = window.innerHeight
            }
        }

        window.addEventListener("resize", handleResize)

        // Función de animación
        const animate = () => {
            if (!canvas || !ctx) return

            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Dibujar líneas de conexión fallidas
            ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
            ctx.lineWidth = 1

            // Intentar conectar nodos pero fallar
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[j].x - nodes[i].x
                    const dy = nodes[j].y - nodes[i].y
                    const distance = Math.sqrt(dx * dx + dy * dy)

                    if (distance < 200) {
                        // Dibujar línea incompleta (conexión fallida)
                        ctx.beginPath()
                        ctx.moveTo(nodes[i].x, nodes[i].y)

                        // Calcular punto intermedio donde la línea se rompe
                        const breakPoint = Math.random() * 0.4 + 0.3 // Entre 30% y 70% del camino
                        const midX = nodes[i].x + dx * breakPoint
                        const midY = nodes[i].y + dy * breakPoint

                        ctx.lineTo(midX, midY)
                        ctx.stroke()

                        // Dibujar símbolo X en el punto de ruptura
                        ctx.fillStyle = "rgba(255, 100, 100, 0.8)"
                        ctx.beginPath()
                        ctx.arc(midX, midY, 3, 0, Math.PI * 2)
                        ctx.fill()
                    }
                }
            }

            // Dibujar nodos (habilidades)
            for (const node of nodes) {
                // Actualizar posición
                node.x += node.vx
                node.y += node.vy

                // Rebotar en los bordes
                if (node.x < 0 || node.x > canvas.width) node.vx *= -1
                if (node.y < 0 || node.y > canvas.height) node.vy *= -1

                // Dibujar círculo de habilidad
                const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius)
                gradient.addColorStop(0, "rgba(66, 153, 225, 0.8)")
                gradient.addColorStop(1, "rgba(56, 178, 172, 0.1)")

                ctx.fillStyle = gradient
                ctx.beginPath()
                ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
                ctx.fill()

                // Dibujar texto de habilidad
                ctx.fillStyle = "white"
                ctx.font = "12px sans-serif"
                ctx.textAlign = "center"
                ctx.textBaseline = "middle"
                ctx.fillText(node.skill, node.x, node.y)
            }

            requestAnimationFrame(animate)
        }

        const animationId = requestAnimationFrame(animate)

        return () => {
            window.removeEventListener("resize", handleResize)
            cancelAnimationFrame(animationId)
        }
    }, [])

    if (!mounted) return null

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-900 to-teal-900 flex flex-col items-center justify-center p-4 overflow-hidden relative">
            {/* Canvas para animación de fondo */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

            {/* Contenido principal */}
            <div className="relative z-10 flex flex-col items-center max-w-2xl">
                {/* Texto 404 con efecto fuzzy */}
                <div className="relative mb-8">
                    <motion.h1
                        className="text-[120px] md:text-[180px] font-bold text-white leading-none tracking-tighter select-none"
                        style={{ textShadow: "0 0 10px rgba(255,255,255,0.5)" }}
                        animate={{
                            textShadow: [
                                "0 0 10px rgba(255,255,255,0.5)",
                                "0 0 20px rgba(255,255,255,0.8)",
                                "0 0 10px rgba(255,255,255,0.5)",
                            ],
                        }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                        404
                    </motion.h1>

                    {/* Capas de efecto fuzzy */}
                    <motion.div
                        className="absolute inset-0 text-[120px] md:text-[180px] font-bold leading-none tracking-tighter select-none"
                        style={{
                            filter: "blur(4px)",
                            opacity: 0.5,
                            color: "#4FD1C5",
                            mixBlendMode: "screen",
                        }}
                        animate={{
                            x: [-2, 2, -2],
                            filter: ["blur(4px)", "blur(6px)", "blur(4px)"],
                        }}
                        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                    >
                        404
                    </motion.div>

                    <motion.div
                        className="absolute inset-0 text-[120px] md:text-[180px] font-bold leading-none tracking-tighter select-none"
                        style={{
                            filter: "blur(4px)",
                            opacity: 0.5,
                            color: "#3182CE",
                            mixBlendMode: "screen",
                        }}
                        animate={{
                            x: [2, -2, 2],
                            filter: ["blur(4px)", "blur(6px)", "blur(4px)"],
                        }}
                        transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY }}
                    >
                        404
                    </motion.div>
                </div>

                {/* Icono de conexión fallida */}
                <motion.div
                    className="mb-6 relative"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                >
                    <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                        <X className="h-10 w-10 text-red-400" />
                    </div>
                    <motion.div
                        className="absolute inset-0 rounded-full border-2 border-red-400"
                        animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    />
                </motion.div>

                {/* Título de error */}
                <motion.h2
                    className="text-2xl md:text-4xl font-bold text-white mb-4 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    Match no encontrado
                </motion.h2>

                {/* Mensaje de error */}
                <motion.p
                    className="text-gray-300 max-w-md text-center mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    No pudimos conectar tus habilidades con la ruta que buscas. Esta conexión no existe o las habilidades
                    requeridas han cambiado.
                </motion.p>


                {/* Botones de navegación */}
                <motion.div
                    className="flex flex-col sm:flex-row gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Link to="/">
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white min-w-[200px]"
                        >
                            <Home className="mr-2 h-4 w-4" />
                            Volver al Inicio
                        </Button>
                    </Link>

                    <Button
                        variant="outline"
                        size="lg"
                        className="border-white bg-slate-600 text-white hover:bg-white min-w-[200px]"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Regresar
                    </Button>
                </motion.div>
            </div>
        </div>
    )
}
