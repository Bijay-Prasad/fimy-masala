/* eslint-disable no-unused-vars */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovies } from '../redux/slices/movieSlice';
import MovieCard from '../components/MovieCard';
import { motion } from 'motion/react';
import { Star, Play, TrendingUp, Users, Award, Film, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

const Index = () => {
  const dispatch = useDispatch();
  const { movies, isLoading, error } = useSelector((state) => state.movies);

  useEffect(() => {
    dispatch(fetchMovies({ limit: 8 }));
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <motion.div 
          className="relative"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full glow-primary"></div>
          <Film className="w-6 h-6 text-primary absolute inset-0 m-auto" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="cinema-card bg-destructive/10 border-destructive/30 p-8 mx-4 my-8 max-w-md mx-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Film className="w-12 h-12 text-destructive mx-auto mb-4" />
          </motion.div>
          <h3 className="text-lg font-semibold text-destructive mb-2">Oops! Something went wrong</h3>
          <p className="text-destructive/80">{error}</p>
        </div>
      </motion.div>
    );
  }

  const stats = [
    { icon: Star, label: 'Total Reviews', value: '10K+', color: 'text-accent' },
    { icon: Users, label: 'Active Users', value: '2.5K+', color: 'text-primary' },
    { icon: Award, label: 'Movies Rated', value: '500+', color: 'text-accent' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative hero-bg py-20 px-4 overflow-hidden">
        <div className="container mx-auto text-center relative z-10">
          {/* Main Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-12"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <Film className="w-16 h-16 text-primary mx-auto mb-4 glow-primary" />
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Welcome to{' '}
              <motion.span 
                className="gradient-text"
                initial={{ backgroundSize: "0% 100%" }}
                animate={{ backgroundSize: "100% 100%" }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                MovieReview
              </motion.span>
            </h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              Discover, review, and track your favorite movies with our vibrant community of film enthusiasts
            </motion.p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <Button 
              size="lg"
              className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary glow-primary text-lg px-8 py-3 h-auto group"
            >
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Explore Movies
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-accent/50 text-accent hover:bg-accent hover:text-accent-foreground glow-accent text-lg px-8 py-3 h-auto group"
            >
              <TrendingUp className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Join Community
            </Button>
          </motion.div>

          {/* Stats Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
                whileHover={{ y: -4 }}
              >
                <Card className="cinema-card text-center p-6 group cursor-pointer">
                  <CardContent className="p-0">
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color} group-hover:scale-110 transition-transform`} />
                    </motion.div>
                    <div className="text-3xl font-bold mb-1 gradient-text">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div 
          className="absolute top-10 left-10 w-20 h-20 rounded-full bg-primary/10 glow-primary"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute top-32 right-16 w-16 h-16 rounded-full bg-accent/10 glow-accent"
          animate={{ 
            y: [0, -15, 0],
            x: [0, 10, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div 
          className="absolute bottom-20 left-1/4 w-12 h-12 rounded-full bg-primary/5"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 4
          }}
        />
      </section>

      {/* Featured Movies Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Sparkles className="w-8 h-8 text-accent mx-auto mb-4" />
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Featured <span className="gradient-accent-text">Movies</span>
            </h2>
            <motion.p 
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Discover the latest and greatest films, handpicked by our community of passionate cinephiles
            </motion.p>
          </motion.div>

          {/* Movies Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {movies.map((movie, index) => (
              <motion.div
                key={movie._id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.2 }
                }}
              >
                <div className="h-full">
                  <MovieCard movie={movie} />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            className="absolute top-1/4 right-8 w-32 h-32 rounded-full bg-gradient-to-br from-primary/5 to-accent/5 blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 px-4 bg-card/20 relative overflow-hidden">
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ rotate: 0 }}
              whileInView={{ rotate: 360 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <Users className="w-12 h-12 text-primary mx-auto mb-6 glow-primary" />
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Join the <span className="gradient-text">Community</span>
            </h2>
            
            <motion.p 
              className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Connect with fellow movie lovers, share your passionate reviews, and discover your next favorite cinematic masterpiece
            </motion.p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg"
                className="bg-gradient-to-r from-accent to-primary hover:from-primary hover:to-accent glow-accent text-lg px-10 py-4 h-auto group"
              >
                <Users className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Get Started Today
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-accent/10"></div>
        </div>
      </section>
    </div>
  );
};

export default Index;